import { describe, it, expect, beforeEach } from 'vitest';
import { api } from '../services/api';

describe('LinkMolay - Testes dos Principais Fluxos do MVP', () => {
  beforeEach(() => {
    // Reset seed data before each test
    api.resetToDefaultSeed();
  });

  it('1. Cadastro de DeMolay deve iniciar com status "pending" e não verificado', () => {
    const res = api.register({
      fullName: 'Lucas Oliveira',
      email: 'lucas.teste@demolay.org.br',
      role: 'demolay',
      city: 'Ariquemes',
      state: 'RO',
      chapterName: 'Capítulo Ariquemes nº 85',
      orderRank: 'DeMolay Ativo',
      cid: '998877',
      phone: '(69) 99111-2222',
    });

    expect(res.user).toBeDefined();
    expect(res.user.role).toBe('demolay');
    expect(res.user.status).toBe('pending');
    expect(res.user.verified).toBe(false);
    expect(res.user.demolayDetails?.chapterName).toBe('Capítulo Ariquemes nº 85');
  });

  it('2. Cadastro de Maçom deve iniciar com status "pending" e vincular Loja/CIM', () => {
    const res = api.register({
      fullName: 'Antônio Ferreira',
      email: 'antonio.teste@empresa.com.br',
      role: 'mason',
      city: 'Porto Velho',
      state: 'RO',
      lodgeName: 'A.R.L.S. União e Trabalho nº 03',
      lodgeObedience: 'GOB-RO',
      cim: '25489',
      profession: 'Diretor Comercial',
      phone: '(69) 98888-7777',
    });

    expect(res.user).toBeDefined();
    expect(res.user.role).toBe('mason');
    expect(res.user.status).toBe('pending');
    expect(res.user.verified).toBe(false);
    expect(res.user.masonDetails?.lodgeName).toBe('A.R.L.S. União e Trabalho nº 03');
    expect(res.user.masonDetails?.profession).toBe('Diretor Comercial');
  });

  it('3. Aprovação de usuário pelo Admin deve atualizar status para "approved", gerar selo verificado e registrar auditoria', () => {
    // Cadastrar usuário pendente
    const { user } = api.register({
      fullName: 'Renato Silva',
      email: 'renato.pendente@demolay.org.br',
      role: 'demolay',
      city: 'Ariquemes',
      state: 'RO',
      chapterName: 'Capítulo Ariquemes nº 85',
    });

    expect(user.status).toBe('pending');

    const adminId = 'a0000000-0000-0000-0000-000000000001';
    const approved = api.approveUser(user.id, adminId, 'Documentação conferida no SISDM');

    expect(approved.status).toBe('approved');
    expect(approved.verified).toBe(true);

    // Verificar se a ação foi registrada no log de auditoria do admin
    const auditLogs = api.getAdminActions();
    const action = auditLogs.find((a) => a.targetId === user.id);
    expect(action).toBeDefined();
    expect(action?.action).toBe('approve');
  });

  it('4. Login & Bloqueio por status de conta', () => {
    // 1. Login com conta aprovada
    const approvedRes = api.login('pedro.henrique@demolay.org.br');
    expect(approvedRes.user).toBeDefined();
    expect(approvedRes.user?.fullName).toBe('Pedro Henrique Lima Leal');

    // 2. Suspender usuário
    const adminId = 'a0000000-0000-0000-0000-000000000001';
    api.setUserStatus(approvedRes.user!.id, 'suspended', adminId, 'Teste de suspensão');

    // 3. Tentar login com conta suspensa
    const suspendedRes = api.login('pedro.henrique@demolay.org.br');
    expect(suspendedRes.user).toBeNull();
    expect(suspendedRes.error).toContain('suspensa');
  });

  it('5. Criação de Empresa vinculada ao perfil de um Maçom', () => {
    const masonId = 'm0000000-0000-0000-0000-000000000001'; // Carlos Eduardo
    const mason = api.getUserById(masonId);
    expect(mason?.role).toBe('mason');

    const newCompany = api.createCompany({
      ownerId: masonId,
      ownerName: mason!.fullName,
      name: 'Rondônia Logística Integrada',
      segment: 'Logística & Transporte',
      city: 'Ariquemes',
      state: 'RO',
      website: 'https://rondialog.com.br',
      description: 'Soluções em fretes e armazenagem de grãos.',
    });

    expect(newCompany.id).toBeDefined();
    expect(newCompany.ownerId).toBe(masonId);

    const masonCompanies = api.getCompaniesByOwner(masonId);
    expect(masonCompanies.some((c) => c.id === newCompany.id)).toBe(true);
  });

  it('6. Publicação de Vaga por Maçom / Empresa', () => {
    const masonId = 'm0000000-0000-0000-0000-000000000001';
    const companies = api.getCompaniesByOwner(masonId);
    const company = companies[0];

    const job = api.createJob({
      companyId: company.id,
      companyName: company.name,
      publisherId: masonId,
      publisherName: 'Carlos Eduardo da Silva',
      title: 'Analista de Dados Júnior',
      description: 'Atuação com relatórios gerenciais e SQL.',
      city: 'Ariquemes',
      state: 'RO',
      workModel: 'hibrido',
      contractType: 'clt',
      salaryMin: 3000,
      salaryMax: 4000,
      salaryNegotiable: false,
      requiredSkills: ['SQL', 'Excel', 'Power BI'],
      benefits: ['Vale Alimentação', 'Plano de Saúde'],
      status: 'aberta',
    });

    expect(job.id).toBeDefined();
    expect(job.status).toBe('aberta');

    const allJobs = api.getJobs();
    expect(allJobs.some((j) => j.id === job.id)).toBe(true);
  });

  it('7. Candidatura de DeMolay a uma vaga com mensagem e currículo', () => {
    const demolayId = 'd0000000-0000-0000-0000-000000000002'; // João Vitor
    const jobId = 'j0000000-0000-0000-0000-000000000001'; // Vaga Front-end da Silva Tech

    const app = api.applyToJob({
      jobId,
      candidateId: demolayId,
      coverNote: 'Tenho grande interesse nesta oportunidade!',
      resumeUrl: 'https://exemplo.com/curriculo.pdf',
    });

    expect(app.id).toBeDefined();
    expect(app.status).toBe('enviada');
    expect(app.candidateId).toBe(demolayId);

    // Tentativa de duplicar candidatura deve lançar erro
    expect(() => {
      api.applyToJob({
        jobId,
        candidateId: demolayId,
      });
    }).toThrow(/já se candidatou/i);
  });

  it('8. Conexão de Networking: solicitação e aceitação entre membros', () => {
    const userA = 'd0000000-0000-0000-0000-000000000002'; // João
    const userB = 'm0000000-0000-0000-0000-000000000002'; // Roberto Mendes

    // Inicialmente não conectados
    expect(api.getConnectionStatus(userA, userB)).toBe('none');

    // A solicita conexão com B
    const conn = api.sendConnectionRequest(userA, userB);
    expect(conn.status).toBe('pending');
    expect(api.getConnectionStatus(userA, userB)).toBe('pending_sent');
    expect(api.getConnectionStatus(userB, userA)).toBe('pending_received');

    // B aceita a conexão
    api.acceptConnection(conn.id);
    expect(api.getConnectionStatus(userA, userB)).toBe('connected');
    expect(api.getConnectionStatus(userB, userA)).toBe('connected');
  });

  it('9. Mensagens Privadas entre membros conectados', () => {
    const userA = 'd0000000-0000-0000-0000-000000000001'; // Pedro
    const userB = 'm0000000-0000-0000-0000-000000000001'; // Carlos (já conectados no seed)

    expect(api.getConnectionStatus(userA, userB)).toBe('connected');

    const msg = api.sendMessage({
      senderId: userA,
      recipientId: userB,
      content: 'Olá Tio Carlos, confirmo o envio do meu portfólio atualizado.',
    });

    expect(msg.id).toBeDefined();
    expect(msg.content).toContain('portfólio');

    const conversations = api.getConversations(userA);
    const activeConv = conversations.find((c) => c.participantIds.includes(userB));
    expect(activeConv).toBeDefined();
  });

  it('10. Painel Administrativo: métricas, moderação e auditoria', () => {
    const stats = api.getStats();
    expect(stats.totalUsers).toBeGreaterThan(0);
    expect(stats.demolaysCount).toBeGreaterThan(0);
    expect(stats.masonsCount).toBeGreaterThan(0);
    expect(stats.activeJobsCount).toBeGreaterThan(0);
    expect(stats.companiesCount).toBeGreaterThan(0);
  });
});
