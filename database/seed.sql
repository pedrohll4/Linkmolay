-- ==============================================================================
-- LINKMOLAY - DADOS DE DEMONSTRAÇÃO (SEED DATA)
-- ATENÇÃO: DADOS DE TESTE/DEMONSTRAÇÃO COM PROPÓSITO DE VALIDAÇÃO DE FLUXOS
-- ==============================================================================

-- 1. CAPÍTULOS DEMONSTRAÇÃO
INSERT INTO chapters (id, name, number, city, state, master_councilor, contact_email, history, active_members_count)
VALUES
('c1000000-0000-0000-0000-000000000001', 'Capítulo Ariquemes', 85, 'Ariquemes', 'RO', 'Lucas Albuquerque', 'ariquemes85@demolay.org.br', 'Fundado em 1989, o Capítulo Ariquemes nº 85 possui vasta tradição na formação de líderes e cidadãos exemplares em Rondônia.', 42),
('c1000000-0000-0000-0000-000000000002', 'Capítulo Porto Velho', 48, 'Porto Velho', 'RO', 'Mateus Vasconcelos', 'portovelho48@demolay.org.br', 'O Capítulo mais antigo do estado de Rondônia, formador de dezenas de líderes em atuação nos setores público e privado.', 65),
('c1000000-0000-0000-0000-000000000003', 'Capítulo Piratininga', 10, 'São Paulo', 'SP', 'Gabriel Fontes', 'piratininga10@demolay.org.br', 'Tradicional capítulo paulista com histórico de fomento a inovação e empreendedorismo entre seus seniores.', 90)
ON CONFLICT (id) DO NOTHING;

-- 2. USUÁRIOS E PERFIS
-- Administrador da plataforma
INSERT INTO profiles (id, email, full_name, role, status, verified, city, state, bio)
VALUES
('a0000000-0000-0000-0000-000000000001', 'admin@linkmolay.com.br', 'Administrador LinkMolay', 'admin', 'approved', TRUE, 'Brasília', 'DF', 'Coordenação Geral da Plataforma LinkMolay e moderação institucional.')
ON CONFLICT (id) DO NOTHING;

-- Maçons
INSERT INTO profiles (id, email, full_name, role, status, verified, city, state, bio, phone, show_phone, linkedin_url)
VALUES
('m0000000-0000-0000-0000-000000000001', 'carlos.silva@silvatech.com.br', 'Carlos Eduardo da Silva', 'mason', 'approved', TRUE, 'Ariquemes', 'RO', 'Empresário do setor de tecnologia, diretor da Silva Tecnologia e entusiasta do desenvolvimento dos jovens DeMolays.', '(69) 99234-5678', TRUE, 'https://linkedin.com/in/carlos-silva-demo'),
('m0000000-0000-0000-0000-000000000002', 'roberto.mendes@mendesadv.com.br', 'Roberto Mendes', 'mason', 'approved', TRUE, 'Porto Velho', 'RO', 'Advogado sênior, sócio do escritório Mendes & Associados, apoiador de projetos sociais da Ordem DeMolay.', '(69) 98412-9090', TRUE, 'https://linkedin.com/in/roberto-mendes-adv'),
('m0000000-0000-0000-0000-000000000003', 'marcos.albuquerque@novos.com.br', 'Marcos Albuquerque', 'mason', 'pending', FALSE, 'Cacoal', 'RO', 'Engenheiro Civil e diretor de construtora local.', '(69) 98111-2233', FALSE, '')
ON CONFLICT (id) DO NOTHING;

-- Detalhes dos Maçons
INSERT INTO mason_profiles (user_id, lodge_name, lodge_obedience, cim, profession, skills)
VALUES
('m0000000-0000-0000-0000-000000000001', 'A.R.L.S. Acácia de Ariquemes nº 15', 'GLOMARON', '12498', 'Empresário / Diretor de TI', ARRAY['Gestão Empresarial', 'Liderança', 'Desenvolvimento de Negócios', 'Inovação']),
('m0000000-0000-0000-0000-000000000002', 'A.R.L.S. União e Trabalho nº 03', 'GOB-RO', '8942', 'Advogado e Consultor Jurídico', ARRAY['Direito Empresarial', 'Contratos', 'Compliance', 'Negociação']),
('m0000000-0000-0000-0000-000000000003', 'A.R.L.S. Guaporé nº 22', 'GLOMARON', '19203', 'Engenheiro Civil', ARRAY['Gestão de Obras', 'Orçamentos', 'Engenharia'])
ON CONFLICT (user_id) DO NOTHING;

-- DeMolays
INSERT INTO profiles (id, email, full_name, role, status, verified, city, state, bio, phone, show_phone, linkedin_url, github_url)
VALUES
('d0000000-0000-0000-0000-000000000001', 'pedro.henrique@demolay.org.br', 'Pedro Henrique Lima Leal', 'demolay', 'approved', TRUE, 'Ariquemes', 'RO', 'Estudante de Engenharia de Software, desenvolvedor Full-Stack apaixonado por TypeScript, React e Node.js. Membro do Capítulo Luciano de Assis nº 118.', '(69) 99345-0011', TRUE, 'https://linkedin.com/in/pedro-henrique-demo', 'https://github.com/pedro-demo'),
('d0000000-0000-0000-0000-000000000002', 'joao.vitor@demolay.org.br', 'João Vitor Souza', 'demolay', 'approved', TRUE, 'Porto Velho', 'RO', 'Graduando em Administração de Empresas. Foco em gestão financeira, análise de dados e rotinas administrativas.', '(69) 99122-3344', TRUE, 'https://linkedin.com/in/joao-vitor-adm', ''),
('d0000000-0000-0000-0000-000000000003', 'arthur.queiroz@demolay.org.br', 'Arthur Queiroz', 'demolay', 'approved', TRUE, 'Ariquemes', 'RO', 'Designer de Produto & UI/UX. Criação de interfaces elegantes, prototipagem ágil e identidade visual.', '(69) 98100-5566', TRUE, 'https://linkedin.com/in/arthur-queiroz-ui', ''),
('d0000000-0000-0000-0000-000000000004', 'felipe.novato@demolay.org.br', 'Felipe Barreto', 'demolay', 'pending', FALSE, 'Ji-Paraná', 'RO', 'Iniciático recente da Ordem, cursando Técnico em Informática.', '(69) 99999-1234', FALSE, '', '')
ON CONFLICT (id) DO NOTHING;

-- Detalhes dos DeMolays
INSERT INTO demolay_profiles (user_id, chapter_id, chapter_name, order_rank, cid, open_to_work, interest_areas, education_level, institution, course, skills)
VALUES
('d0000000-0000-0000-0000-000000000001', 'c1000000-0000-0000-0000-000000000001', 'Capítulo Luciano de Assis nº 118', 'DeMolay Ativo', '98451', TRUE, ARRAY['Desenvolvimento', 'Tecnologia', 'Engenharia'], 'Superior em andamento', 'Universidade Federal de Rondônia', 'Engenharia de Software', ARRAY['React', 'TypeScript', 'Node.js', 'PostgreSQL', 'Tailwind CSS', 'Git', 'Docker']),
('d0000000-0000-0000-0000-000000000002', 'c1000000-0000-0000-0000-000000000002', 'Capítulo Porto Velho nº 48', 'DeMolay Ativo', '110294', TRUE, ARRAY['Administração', 'Finanças', 'Contabilidade'], 'Superior em andamento', 'UNIR', 'Administração', ARRAY['Excel Avançado', 'Power BI', 'Contabilidade Básica', 'Comunicação', 'Rotinas Administrativas']),
('d0000000-0000-0000-0000-000000000003', 'c1000000-0000-0000-0000-000000000001', 'Capítulo Ariquemes nº 85', 'Sênior DeMolay', '103429', TRUE, ARRAY['Design', 'Marketing', 'Tecnologia'], 'Superior concluído', 'PUC', 'Design Digital', ARRAY['Figma', 'UI/UX Design', 'Branding', 'Design System', 'Prototipagem']),
('d0000000-0000-0000-0000-000000000004', NULL, 'Capítulo Ji-Paraná nº 120', 'Iniciático', '134012', TRUE, ARRAY['Tecnologia', 'Estágio', 'Jovem Aprendiz'], 'Técnico em andamento', 'IFRO', 'Informática', ARRAY['Hardware', 'Redes Básicas', 'Suporte ao Usuário'])
ON CONFLICT (user_id) DO NOTHING;

-- 3. EMPRESAS DE MAÇONS
INSERT INTO companies (id, owner_id, name, segment, city, state, website, instagram, whatsapp, description)
VALUES
('e0000000-0000-0000-0000-000000000001', 'm0000000-0000-0000-0000-000000000001', 'Silva Tecnologia & Inovação', 'Tecnologia da Informação', 'Ariquemes', 'RO', 'https://silvatech.com.br', '@silvatech.ro', '(69) 99234-5678', 'Empresa de desenvolvimento de software sob medida, soluções em nuvem e infraestrutura para o agronegócio e varejo.'),
('e0000000-0000-0000-0000-000000000002', 'm0000000-0000-0000-0000-000000000002', 'Mendes & Associados Consultoria', 'Consultoria Jurídica e Empresarial', 'Porto Velho', 'RO', 'https://mendesadvogados.com.br', '@mendesadv', '(69) 98412-9090', 'Escritório de advocacia empresarial especializado em estruturação societária, tributário e contratos comerciais.')
ON CONFLICT (id) DO NOTHING;

-- 4. OPORTUNIDADES / VAGAS
INSERT INTO jobs (id, company_id, publisher_id, title, description, city, state, work_model, contract_type, salary_min, salary_max, salary_negotiable, education_requirement, experience_requirement, required_skills, benefits, status)
VALUES
('j0000000-0000-0000-0000-000000000001', 'e0000000-0000-0000-0000-000000000001', 'm0000000-0000-0000-0000-000000000001', 
 'Desenvolvedor Front-end Júnior (React / TS)', 
 'Buscamos um talento DeMolay dedicado para integrar nossa equipe de desenvolvimento no desenvolvimento de aplicações modernas com React, TypeScript e Tailwind. Excelente oportunidade de aceleração de carreira com mentoria técnica direta.', 
 'Ariquemes', 'RO', 'hibrido', 'clt', 2800.00, 3800.00, FALSE, 
 'Superior em andamento ou concluído em Ciência da Computação, Engenharia de Software ou correlatas', 
 'Projetos acadêmicos ou 6 meses de experiência com frontend', 
 ARRAY['React', 'TypeScript', 'Tailwind CSS', 'Git', 'Consumo de APIs REST'], 
 ARRAY['Vale Alimentação', 'Plano de Saúde', 'Horário Flexível', 'Auxílio Cursos'], 
 'aberta'),

('j0000000-0000-0000-0000-000000000002', 'e0000000-0000-0000-0000-000000000001', 'm0000000-0000-0000-0000-000000000001', 
 'Estágio em Suporte Técnico e Redes', 
 'Vaga de estágio voltada a jovens DeMolays iniciando no mercado de TI. Atividades de atendimento interno, configuração de estações de trabalho e suporte a clientes de sistemas.', 
 'Ariquemes', 'RO', 'presencial', 'estagio', 1200.00, 1500.00, FALSE, 
 'Ensino Técnico ou Superior em andamento', 
 'Não é exigida experiência prévia; valorizamos pró-atividade e boa comunicação', 
 ARRAY['Windows', 'Redes Básicas', 'Atendimento', 'Boa Comunicação'], 
 ARRAY['Bolsa de Estágio', 'Auxílio Transporte', 'Seguro de Vida'], 
 'aberta'),

('j0000000-0000-0000-0000-000000000003', 'e0000000-0000-0000-0000-000000000002', 'm0000000-0000-0000-0000-000000000002', 
 'Assistente de Controladoria e Rotinas Administrativas', 
 'Oportunidade para atuar no controle financeiro, emissão de relatórios gerenciais e organização de documentos contábeis do escritório.', 
 'Porto Velho', 'RO', 'presencial', 'clt', 2400.00, 3100.00, FALSE, 
 'Graduação em Administração, Contabilidade ou Economia (completo ou último ano)', 
 '1 ano em rotinas financeiras/administrativas', 
 ARRAY['Excel Intermediário/Avançado', 'Emissão de NFs', 'Fluxo de Caixa', 'Organização'], 
 ARRAY['Vale Refeição', 'Vale Transporte', 'Plano Odontológico'], 
 'aberta')
ON CONFLICT (id) DO NOTHING;

-- 5. CANDIDATURAS DEMONSTRAÇÃO
INSERT INTO job_applications (id, job_id, candidate_id, cover_note, status)
VALUES
('ja000000-0000-0000-0000-000000000001', 'j0000000-0000-0000-0000-000000000001', 'd0000000-0000-0000-0000-000000000001', 
 'Olá Tio Carlos! Tenho me dedicado intensamente a projetos em React e TypeScript, construindo soluções completas com alta qualidade de código. Gostaria muito da oportunidade de somar à Silva Tecnologia!', 
 'em_analise'),
('ja000000-0000-0000-0000-000000000002', 'j0000000-0000-0000-0000-000000000003', 'd0000000-0000-0000-0000-000000000002', 
 'Boa tarde Tio Roberto! Estou no 5º período de Administração e tenho forte disciplina com rotinas contábeis e planilhas gerenciais.', 
 'entrevista')
ON CONFLICT (id) DO NOTHING;

-- 6. CONEXÕES DE NETWORKING
INSERT INTO connections (id, requester_id, addressee_id, status)
VALUES
('cn000000-0000-0000-0000-000000000001', 'd0000000-0000-0000-0000-000000000001', 'm0000000-0000-0000-0000-000000000001', 'accepted'),
('cn000000-0000-0000-0000-000000000002', 'd0000000-0000-0000-0000-000000000001', 'd0000000-0000-0000-0000-000000000002', 'accepted'),
('cn000000-0000-0000-0000-000000000003', 'd0000000-0000-0000-0000-000000000003', 'd0000000-0000-0000-0000-000000000001', 'pending')
ON CONFLICT (id) DO NOTHING;

-- 7. CONVERSA E MENSAGENS DEMO
INSERT INTO conversations (id, participant_ids)
VALUES
('cv000000-0000-0000-0000-000000000001', ARRAY['d0000000-0000-0000-0000-000000000001'::UUID, 'm0000000-0000-0000-0000-000000000001'::UUID])
ON CONFLICT (id) DO NOTHING;

INSERT INTO messages (id, conversation_id, sender_id, content, read)
VALUES
('ms000000-0000-0000-0000-000000000001', 'cv000000-0000-0000-0000-000000000001', 'm0000000-0000-0000-0000-000000000001', 'Olá Pedro! Vi sua candidatura para a vaga de desenvolvedor front-end na Silva Tecnologia. Fiquei muito impressionado com seus projetos no GitHub.', TRUE),
('ms000000-0000-0000-0000-000000000002', 'cv000000-0000-0000-0000-000000000001', 'd0000000-0000-0000-0000-000000000001', 'Muito obrigado pelo feedback, Tio Carlos! Estou à disposição para conversar sobre os desafios técnicos da equipe.', TRUE)
ON CONFLICT (id) DO NOTHING;

-- 8. PUBLICAÇÕES NO FEED
INSERT INTO posts (id, author_id, chapter_id, type, title, content, likes)
VALUES
('p0000000-0000-0000-0000-000000000001', 'm0000000-0000-0000-0000-000000000001', NULL, 'vaga', 'Oportunidades Abertas na Silva Tecnologia', 'Irmãos e sobrinhos, estamos expandindo a equipe da Silva Tecnologia e priorizando a contratação de DeMolays comprometidos. Confira as vagas no mural de Oportunidades!', ARRAY['d0000000-0000-0000-0000-000000000001'::UUID, 'd0000000-0000-0000-0000-000000000002'::UUID]),
('p0000000-0000-0000-0000-000000000002', 'd0000000-0000-0000-0000-000000000001', 'c1000000-0000-0000-0000-000000000001', 'projeto_capitulo', 'Campanha de Arrecadação de Alimentos do Cap. Ariquemes', 'Com imenso orgulho realizamos no último sábado nossa arrecadação semestral de alimentos, atendendo mais de 80 famílias em vulnerabilidade em Ariquemes. A liderança jovem em ação!', ARRAY['m0000000-0000-0000-0000-000000000001'::UUID, 'm0000000-0000-0000-0000-000000000002'::UUID]),
('p0000000-0000-0000-0000-000000000003', 'd0000000-0000-0000-0000-000000000002', NULL, 'conquista', 'Novo Marco: Certificação em Análise Financeira', 'Feliz em compartilhar a conclusão do curso intensivo em Análise de Indicadores Financeiros. Pronto para novos desafios no mercado de trabalho!', ARRAY['d0000000-0000-0000-0000-000000000001'::UUID])
ON CONFLICT (id) DO NOTHING;

-- 9. NOTIFICAÇÕES DEMO
INSERT INTO notifications (id, user_id, title, message, type, link, read)
VALUES
('nt000000-0000-0000-0000-000000000001', 'd0000000-0000-0000-0000-000000000001', 'Candidatura em Análise', 'Sua candidatura para a vaga "Desenvolvedor Front-end Júnior" na Silva Tecnologia avançou para em análise.', 'application', '/minhas-candidaturas', FALSE),
('nt000000-0000-0000-0000-000000000002', 'd0000000-0000-0000-0000-000000000001', 'Nova Mensagem', 'Carlos Eduardo da Silva enviou uma nova mensagem.', 'message', '/mensagens', FALSE)
ON CONFLICT (id) DO NOTHING;
