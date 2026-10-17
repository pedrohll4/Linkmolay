import {
  UserProfile,
  UserRole,
  UserStatus,
  Chapter,
  Company,
  Job,
  JobApplication,
  Connection,
  Conversation,
  Message,
  Post,
  NotificationItem,
  AdminAction,
  SystemStats,
  ApplicationStatus,
} from '../types';

import {
  INITIAL_USERS,
  INITIAL_CHAPTERS,
  INITIAL_COMPANIES,
  INITIAL_JOBS,
  INITIAL_APPLICATIONS,
  INITIAL_CONNECTIONS,
  INITIAL_CONVERSATIONS,
  INITIAL_MESSAGES,
  INITIAL_POSTS,
  INITIAL_NOTIFICATIONS,
  INITIAL_ADMIN_ACTIONS,
} from './mockData';
import { supabase, isSupabaseConfigured } from './supabase';

// Storage Keys
const STORAGE_PREFIX = 'linkmolay_';
const KEYS = {
  USERS: `${STORAGE_PREFIX}users`,
  CHAPTERS: `${STORAGE_PREFIX}chapters`,
  COMPANIES: `${STORAGE_PREFIX}companies`,
  JOBS: `${STORAGE_PREFIX}jobs`,
  APPLICATIONS: `${STORAGE_PREFIX}applications`,
  CONNECTIONS: `${STORAGE_PREFIX}connections`,
  CONVERSATIONS: `${STORAGE_PREFIX}conversations`,
  MESSAGES: `${STORAGE_PREFIX}messages`,
  POSTS: `${STORAGE_PREFIX}posts`,
  NOTIFICATIONS: `${STORAGE_PREFIX}notifications`,
  ADMIN_ACTIONS: `${STORAGE_PREFIX}admin_actions`,
  CURRENT_USER_ID: `${STORAGE_PREFIX}current_user_id`,
};

// In-memory fallback store for Node.js / SSR / Vitest
const memoryStore = new Map<string, string>();

const safeStorage = {
  getItem: (key: string): string | null => {
    try {
      if (typeof window !== 'undefined' && window.localStorage) {
        return window.localStorage.getItem(key);
      }
    } catch {}
    return memoryStore.get(key) || null;
  },
  setItem: (key: string, value: string): void => {
    try {
      if (typeof window !== 'undefined' && window.localStorage) {
        window.localStorage.setItem(key, value);
        return;
      }
    } catch {}
    memoryStore.set(key, value);
  },
  removeItem: (key: string): void => {
    try {
      if (typeof window !== 'undefined' && window.localStorage) {
        window.localStorage.removeItem(key);
        return;
      }
    } catch {}
    memoryStore.delete(key);
  },
};

function getFromStorage<T>(key: string, initialData: T): T {
  try {
    const item = safeStorage.getItem(key);
    if (!item) {
      safeStorage.setItem(key, JSON.stringify(initialData));
      return initialData;
    }
    return JSON.parse(item);
  } catch (err) {
    console.error(`Erro ao carregar dados da chave ${key}:`, err);
    return initialData;
  }
}

function saveToStorage<T>(key: string, data: T): void {
  try {
    safeStorage.setItem(key, JSON.stringify(data));
  } catch (err) {
    console.error(`Erro ao salvar dados na chave ${key}:`, err);
  }
}

// ============================================================================
// API SERVICE
// ============================================================================
export const api = {
  // --------------------------------------------------------------------------
  // SESSÃO & AUTENTICAÇÃO
  // --------------------------------------------------------------------------
  getCurrentUser(): UserProfile | null {
    const users = this.getUsers();
    const storedId = safeStorage.getItem(KEYS.CURRENT_USER_ID);
    if (!storedId) {
      // Padrão de demonstração inicial: Pedro Henrique (DeMolay aprovado)
      return users.find((u) => u.id === 'd0000000-0000-0000-0000-000000000001') || null;
    }
    return users.find((u) => u.id === storedId) || null;
  },

  setCurrentUser(userId: string | null): void {
    if (userId) {
      safeStorage.setItem(KEYS.CURRENT_USER_ID, userId);
    } else {
      safeStorage.removeItem(KEYS.CURRENT_USER_ID);
    }
  },

  login(email: string): { user: UserProfile | null; error?: string } {
    const users = this.getUsers();
    const cleanEmail = email.trim().toLowerCase();
    const user = users.find((u) => u.email.toLowerCase() === cleanEmail);

    if (!user) {
      return { user: null, error: 'Usuário não encontrado. Verifique seu e-mail.' };
    }

    if (user.status === 'suspended') {
      return { user: null, error: 'Sua conta foi suspensa pela moderação institucional.' };
    }

    if (user.status === 'rejected') {
      return { user: null, error: 'Seu cadastro foi recusado pela administração.' };
    }

    // Salvar sessão
    this.setCurrentUser(user.id);
    return { user };
  },

  register(data: {
    fullName: string;
    email: string;
    role: UserRole;
    city: string;
    state: string;
    chapterName?: string;
    orderRank?: string;
    cid?: string;
    lodgeName?: string;
    lodgeObedience?: string;
    cim?: string;
    profession?: string;
    phone?: string;
  }): { user: UserProfile; error?: string } {
    const users = this.getUsers();
    const cleanEmail = data.email.trim().toLowerCase();

    if (users.some((u) => u.email.toLowerCase() === cleanEmail)) {
      throw new Error('Este e-mail já está cadastrado no LinkMolay.');
    }

    const newId = `u-${Date.now()}`;
    const newUser: UserProfile = {
      id: newId,
      email: cleanEmail,
      fullName: data.fullName.trim(),
      role: data.role,
      status: 'pending', // TODO CADASTRO COMEÇA PENDENTE
      verified: false,
      city: data.city.trim(),
      state: data.state.trim().toUpperCase(),
      phone: data.phone,
      showPhone: true,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
      bio: data.role === 'demolay' 
        ? `Membro da Ordem DeMolay (${data.chapterName || ''}).`
        : `Membro da Maçonaria (${data.lodgeName || ''}), atuando como ${data.profession || ''}.`,
    };

    if (data.role === 'demolay') {
      newUser.demolayDetails = {
        chapterName: data.chapterName || 'Capítulo Não Informado',
        orderRank: data.orderRank || 'DeMolay Ativo',
        cid: data.cid || '',
        openToWork: true,
        interestAreas: ['Tecnologia', 'Desenvolvimento'],
        skills: ['Comunicação', 'Liderança'],
      };
    } else if (data.role === 'mason') {
      newUser.masonDetails = {
        lodgeName: data.lodgeName || 'Loja Maçônica',
        lodgeObedience: data.lodgeObedience || 'GLOMARON / GOB',
        cim: data.cim || '',
        profession: data.profession || 'Empresário',
        skills: ['Gestão', 'Liderança Empresarial'],
      };
    }

    users.push(newUser);
    saveToStorage(KEYS.USERS, users);

    // Salva na sessão para o usuário visualizar o status 'pending'
    this.setCurrentUser(newUser.id);
    return { user: newUser };
  },

  logout(): void {
    safeStorage.removeItem(KEYS.CURRENT_USER_ID);
  },

  // --------------------------------------------------------------------------
  // USUÁRIOS & PERFIS
  // --------------------------------------------------------------------------
  getUsers(): UserProfile[] {
    const users = getFromStorage<UserProfile[]>(KEYS.USERS, INITIAL_USERS);
    let changed = false;
    for (const u of users) {
      if (u.id === 'd0000000-0000-0000-0000-000000000001') {
        if (u.fullName === 'Pedro Henrique Lima') {
          u.fullName = 'Pedro Henrique Lima Leal';
          changed = true;
        }
        if (u.demolayDetails && u.demolayDetails.chapterName.includes('Ariquemes')) {
          u.demolayDetails.chapterName = 'Capítulo Luciano de Assis nº 118';
          changed = true;
        }
        if (
          u.demolayDetails &&
          (u.demolayDetails.orderRank !== 'DeMolay Ativo' &&
            (u.demolayDetails.orderRank.includes('Sênior') ||
              u.demolayDetails.orderRank.includes('Senior') ||
              u.demolayDetails.orderRank.includes('Past Mestre')))
        ) {
          u.demolayDetails.orderRank = 'DeMolay Ativo';
          changed = true;
        }
        if (u.bio && (u.bio.includes('Past Mestre Conselheiro') || u.bio.includes('Sênior') || u.bio.includes('Senior'))) {
          u.bio = u.bio
            .replace(/Past Mestre Conselheiro do Cap[íi]tulo Luciano de Assis nº 118\.\s*/g, 'Membro ativo do Capítulo Luciano de Assis nº 118. ')
            .replace(/Past Mestre Conselheiro do Cap\. Ariquemes\.\s*/g, 'Membro ativo do Capítulo Luciano de Assis nº 118. ')
            .replace(/Past Mestre Conselheiro/g, 'DeMolay Ativo');
          changed = true;
        }
      }
    }
    if (changed) {
      saveToStorage(KEYS.USERS, users);
    }
    return users;
  },

  getUserById(id: string): UserProfile | null {
    return this.getUsers().find((u) => u.id === id) || null;
  },

  updateProfile(id: string, updates: Partial<UserProfile>): UserProfile {
    const users = this.getUsers();
    const index = users.findIndex((u) => u.id === id);
    if (index === -1) throw new Error('Usuário não encontrado');

    const updatedUser = {
      ...users[index],
      ...updates,
      updatedAt: new Date().toISOString(),
    };

    users[index] = updatedUser;
    saveToStorage(KEYS.USERS, users);

    // Sincronizar em tempo real com o banco de dados Supabase na nuvem
    if (isSupabaseConfigured && supabase) {
      this.syncProfileToSupabase(updatedUser).catch((err) => {
        console.warn('[Supabase Sync] Falha ao sincronizar perfil:', err);
      });
    }

    return updatedUser;
  },

  async syncProfileToSupabase(user: UserProfile): Promise<boolean> {
    if (!isSupabaseConfigured || !supabase) return false;

    try {
      const row: Record<string, any> = {
        id: user.id,
        email: user.email,
        full_name: user.fullName,
        role: user.role,
        status: user.status,
        verified: user.verified,
        avatar_url: user.avatarUrl || null,
        banner_url: user.bannerUrl || null,
        bio: user.bio || null,
        city: user.city || 'Não informada',
        state: user.state || 'UF',
        phone: user.phone || null,
        show_phone: user.showPhone ?? false,
        linkedin_url: user.linkedinUrl || null,
        instagram_url: user.instagramUrl || null,
        github_url: user.githubUrl || null,
        portfolio_url: user.portfolioUrl || null,
        resume_url: user.resumeUrl || null,
        show_resume: user.showResume ?? true,
        updated_at: new Date().toISOString(),
      };

      const { error } = await supabase.from('profiles').upsert(row);
      if (error) {
        console.warn('[Supabase Sync] Erro ao sincronizar perfil no banco:', error.message);
        return false;
      }
      console.log('[Supabase Sync] Perfil salvo com sucesso na nuvem:', user.id);
      return true;
    } catch (err) {
      console.warn('[Supabase Sync] Exceção ao sincronizar perfil:', err);
      return false;
    }
  },

  async fetchCloudProfiles(): Promise<UserProfile[]> {
    if (!isSupabaseConfigured || !supabase) return this.getUsers();

    try {
      const { data, error } = await supabase.from('profiles').select('*');
      if (!error && data && data.length > 0) {
        const localUsers = this.getUsers();
        const mergedUsers = localUsers.map((u) => {
          const cloud = data.find(
            (p) => p.id === u.id || p.email.toLowerCase() === u.email.toLowerCase()
          );
          if (!cloud) return u;
          return {
            ...u,
            avatarUrl: cloud.avatar_url || u.avatarUrl,
            bannerUrl: cloud.banner_url || u.bannerUrl,
            fullName: cloud.full_name || u.fullName,
            bio: cloud.bio ?? u.bio,
            city: cloud.city || u.city,
            state: cloud.state || u.state,
            phone: cloud.phone || u.phone,
            linkedinUrl: cloud.linkedin_url || u.linkedinUrl,
            githubUrl: cloud.github_url || u.githubUrl,
            instagramUrl: cloud.instagram_url || u.instagramUrl,
            resumeUrl: cloud.resume_url || u.resumeUrl,
            verified: cloud.verified ?? u.verified,
            status: cloud.status || u.status,
          };
        });

        // Adicionar perfis criados em outros dispositivos
        for (const cloud of data) {
          const exists = mergedUsers.some(
            (u) => u.id === cloud.id || u.email.toLowerCase() === cloud.email.toLowerCase()
          );
          if (!exists) {
            mergedUsers.push({
              id: cloud.id,
              email: cloud.email,
              fullName: cloud.full_name,
              role: cloud.role,
              status: cloud.status,
              verified: cloud.verified,
              avatarUrl: cloud.avatar_url,
              bannerUrl: cloud.banner_url,
              bio: cloud.bio || '',
              city: cloud.city || '',
              state: cloud.state || '',
              phone: cloud.phone,
              linkedinUrl: cloud.linkedin_url,
              githubUrl: cloud.github_url,
              instagramUrl: cloud.instagram_url,
              resumeUrl: cloud.resume_url,
              createdAt: cloud.created_at,
              updatedAt: cloud.updated_at,
            } as UserProfile);
          }
        }

        saveToStorage(KEYS.USERS, mergedUsers);
        return mergedUsers;
      }
    } catch (err) {
      console.warn('[Supabase Sync] Falha ao carregar perfis da nuvem:', err);
    }

    return this.getUsers();
  },

  // --------------------------------------------------------------------------
  // ADMINISTRAÇÃO & MODERAÇÃO
  // --------------------------------------------------------------------------
  getPendingUsers(): UserProfile[] {
    return this.getUsers().filter((u) => u.status === 'pending');
  },

  approveUser(userId: string, adminId: string, reason?: string): UserProfile {
    const user = this.getUserById(userId);
    if (!user) throw new Error('Usuário não encontrado');

    const updated = this.updateProfile(userId, {
      status: 'approved',
      verified: true,
    });

    // Registrar ação do admin
    this.logAdminAction({
      adminId,
      adminName: this.getUserById(adminId)?.fullName || 'Administrador',
      targetType: 'user',
      targetId: userId,
      targetName: `${user.fullName} (${user.role === 'demolay' ? 'DeMolay' : 'Maçom'})`,
      action: 'approve',
      reason: reason || 'Cadastro aprovado e verificado conforme regulamento.',
    });

    // Enviar notificação ao usuário
    this.createNotification({
      userId,
      title: 'Cadastro Aprovado!',
      message: `Parabéns, ${user.fullName}! Seu acesso ao LinkMolay foi aprovado com selo de verificação.`,
      type: 'approval',
      link: '/dashboard',
    });

    return updated;
  },

  rejectUser(userId: string, adminId: string, reason?: string): UserProfile {
    const user = this.getUserById(userId);
    if (!user) throw new Error('Usuário não encontrado');

    const updated = this.updateProfile(userId, {
      status: 'rejected',
      verified: false,
    });

    this.logAdminAction({
      adminId,
      adminName: this.getUserById(adminId)?.fullName || 'Administrador',
      targetType: 'user',
      targetId: userId,
      targetName: `${user.fullName} (${user.role})`,
      action: 'reject',
      reason: reason || 'Cadastro recusado pela moderação.',
    });

    return updated;
  },

  setUserStatus(userId: string, status: UserStatus, adminId: string, reason?: string): UserProfile {
    const user = this.getUserById(userId);
    if (!user) throw new Error('Usuário não encontrado');

    const updated = this.updateProfile(userId, {
      status,
      verified: status === 'approved',
    });

    this.logAdminAction({
      adminId,
      adminName: this.getUserById(adminId)?.fullName || 'Administrador',
      targetType: 'user',
      targetId: userId,
      targetName: user.fullName,
      action: status === 'suspended' ? 'suspend' : status === 'approved' ? 'activate' : 'reject',
      reason,
    });

    return updated;
  },

  logAdminAction(action: Omit<AdminAction, 'id' | 'createdAt'>): void {
    const actions = this.getAdminActions();
    const newAction: AdminAction = {
      ...action,
      id: `act-${Date.now()}`,
      createdAt: new Date().toISOString(),
    };
    actions.unshift(newAction);
    saveToStorage(KEYS.ADMIN_ACTIONS, actions);
  },

  getAdminActions(): AdminAction[] {
    return getFromStorage<AdminAction[]>(KEYS.ADMIN_ACTIONS, INITIAL_ADMIN_ACTIONS);
  },

  getStats(): SystemStats {
    const users = this.getUsers();
    const companies = this.getCompanies();
    const chapters = this.getChapters();
    const jobs = this.getJobs();
    const applications = this.getApplications();
    const posts = this.getPosts();

    return {
      totalUsers: users.length,
      demolaysCount: users.filter((u) => u.role === 'demolay' && u.status === 'approved').length,
      masonsCount: users.filter((u) => u.role === 'mason' && u.status === 'approved').length,
      pendingUsersCount: users.filter((u) => u.status === 'pending').length,
      companiesCount: companies.length,
      chaptersCount: chapters.length,
      activeJobsCount: jobs.filter((j) => j.status === 'aberta').length,
      applicationsCount: applications.length,
      postsCount: posts.length,
    };
  },

  // --------------------------------------------------------------------------
  // EMPRESAS (Pertencentes a Maçons)
  // --------------------------------------------------------------------------
  getCompanies(): Company[] {
    return getFromStorage<Company[]>(KEYS.COMPANIES, INITIAL_COMPANIES);
  },

  getCompanyById(id: string): Company | null {
    return this.getCompanies().find((c) => c.id === id) || null;
  },

  getCompaniesByOwner(ownerId: string): Company[] {
    return this.getCompanies().filter((c) => c.ownerId === ownerId);
  },

  createCompany(companyData: Omit<Company, 'id' | 'createdAt'>): Company {
    const companies = this.getCompanies();
    const newCompany: Company = {
      ...companyData,
      id: `e-${Date.now()}`,
      createdAt: new Date().toISOString(),
    };
    companies.push(newCompany);
    saveToStorage(KEYS.COMPANIES, companies);
    return newCompany;
  },

  updateCompany(id: string, updates: Partial<Company>): Company {
    const companies = this.getCompanies();
    const index = companies.findIndex((c) => c.id === id);
    if (index === -1) throw new Error('Empresa não encontrada');
    companies[index] = { ...companies[index], ...updates };
    saveToStorage(KEYS.COMPANIES, companies);
    return companies[index];
  },

  // --------------------------------------------------------------------------
  // CAPÍTULOS
  // --------------------------------------------------------------------------
  getChapters(): Chapter[] {
    const chapters = getFromStorage<Chapter[]>(KEYS.CHAPTERS, INITIAL_CHAPTERS);
    let changed = false;
    for (const c of chapters) {
      if (c.id === 'c1000000-0000-0000-0000-000000000001') {
        if (c.name !== 'Capítulo Luciano de Assis' || c.number !== 118) {
          c.name = 'Capítulo Luciano de Assis';
          c.number = 118;
          c.logoUrl = '/chapters/luciano-de-assis-118.png';
          changed = true;
        }
      }
    }
    if (changed) {
      saveToStorage(KEYS.CHAPTERS, chapters);
    }
    return chapters;
  },

  getChapterById(id: string): Chapter | null {
    return this.getChapters().find((c) => c.id === id) || null;
  },

  createChapter(data: Omit<Chapter, 'id' | 'createdAt'>): Chapter {
    const chapters = this.getChapters();
    const newChapter: Chapter = {
      ...data,
      id: `c-${Date.now()}`,
      createdAt: new Date().toISOString(),
    };
    chapters.push(newChapter);
    saveToStorage(KEYS.CHAPTERS, chapters);

    if (isSupabaseConfigured && supabase) {
      supabase.from('chapters').upsert({
        id: newChapter.id,
        name: newChapter.name,
        number: newChapter.number,
        city: newChapter.city,
        state: newChapter.state,
        logo_url: newChapter.logoUrl,
        banner_url: newChapter.bannerUrl,
        history: newChapter.history,
        master_councilor: newChapter.masterCouncilor,
        contact_email: newChapter.contactEmail,
        contact_phone: newChapter.contactPhone,
        instagram: newChapter.instagram,
        active_members_count: newChapter.activeMembersCount || 0,
      }).then(() => {}, () => {});
    }

    return newChapter;
  },

  updateChapter(id: string, updates: Partial<Chapter>): Chapter {
    const chapters = this.getChapters();
    const index = chapters.findIndex((c) => c.id === id);
    if (index === -1) throw new Error('Capítulo não encontrado');

    const updated = { ...chapters[index], ...updates };
    chapters[index] = updated;
    saveToStorage(KEYS.CHAPTERS, chapters);

    if (isSupabaseConfigured && supabase) {
      supabase.from('chapters').upsert({
        id: updated.id,
        name: updated.name,
        number: updated.number,
        city: updated.city,
        state: updated.state,
        logo_url: updated.logoUrl,
        banner_url: updated.bannerUrl,
        history: updated.history,
        master_councilor: updated.masterCouncilor,
        contact_email: updated.contactEmail,
        contact_phone: updated.contactPhone,
        instagram: updated.instagram,
        active_members_count: updated.activeMembersCount || 0,
      }).then(() => {}, () => {});
    }

    return updated;
  },

  deleteChapter(id: string): void {
    const chapters = this.getChapters().filter((c) => c.id !== id);
    saveToStorage(KEYS.CHAPTERS, chapters);

    if (isSupabaseConfigured && supabase) {
      supabase.from('chapters').delete().eq('id', id).then(() => {}, () => {});
    }
  },

  updateUserChapter(userId: string, chapterId: string | undefined, chapterName: string): UserProfile {
    const user = this.getUserById(userId);
    if (!user) throw new Error('Usuário não encontrado');

    if (user.role === 'demolay' && user.demolayDetails) {
      return this.updateProfile(userId, {
        demolayDetails: {
          ...user.demolayDetails,
          chapterId,
          chapterName,
        },
      });
    }

    return user;
  },

  // --------------------------------------------------------------------------
  // VAGAS / OPORTUNIDADES
  // --------------------------------------------------------------------------
  getJobs(): Job[] {
    return getFromStorage<Job[]>(KEYS.JOBS, INITIAL_JOBS);
  },

  getJobById(id: string): Job | null {
    return this.getJobs().find((j) => j.id === id) || null;
  },

  getJobsByPublisher(publisherId: string): Job[] {
    return this.getJobs().filter((j) => j.publisherId === publisherId);
  },

  createJob(jobData: Omit<Job, 'id' | 'createdAt' | 'applicationsCount'>): Job {
    const jobs = this.getJobs();
    const newJob: Job = {
      ...jobData,
      id: `j-${Date.now()}`,
      createdAt: new Date().toISOString(),
      applicationsCount: 0,
    };
    jobs.unshift(newJob);
    saveToStorage(KEYS.JOBS, jobs);

    // Criar publicação automática no Feed com anúncio da nova vaga
    this.createPost({
      authorId: newJob.publisherId,
      authorName: newJob.publisherName || 'Maçom',
      authorRole: 'mason',
      authorVerified: true,
      companyId: newJob.companyId,
      companyName: newJob.companyName,
      type: 'vaga',
      title: `Nova Vaga Aberta: ${newJob.title}`,
      content: `A empresa ${newJob.companyName} publicou uma nova oportunidade para "${newJob.title}" em ${newJob.city} - ${newJob.state} (${newJob.contractType.toUpperCase()}). Talentos DeMolay, candidate-se!`,
      likes: [],
      comments: [],
    });

    return newJob;
  },

  updateJobStatus(id: string, status: Job['status']): Job {
    const jobs = this.getJobs();
    const index = jobs.findIndex((j) => j.id === id);
    if (index === -1) throw new Error('Vaga não encontrada');
    jobs[index].status = status;
    saveToStorage(KEYS.JOBS, jobs);
    return jobs[index];
  },

  // --------------------------------------------------------------------------
  // CANDIDATURAS
  // --------------------------------------------------------------------------
  getApplications(): JobApplication[] {
    return getFromStorage<JobApplication[]>(KEYS.APPLICATIONS, INITIAL_APPLICATIONS);
  },

  getApplicationsByJob(jobId: string): JobApplication[] {
    return this.getApplications().filter((a) => a.jobId === jobId);
  },

  getApplicationsByCandidate(candidateId: string): JobApplication[] {
    return this.getApplications().filter((a) => a.candidateId === candidateId);
  },

  applyToJob(data: {
    jobId: string;
    candidateId: string;
    coverNote?: string;
    resumeUrl?: string;
  }): JobApplication {
    const applications = this.getApplications();
    const existing = applications.find(
      (a) => a.jobId === data.jobId && a.candidateId === data.candidateId
    );
    if (existing) {
      throw new Error('Você já se candidatou a esta vaga anteriormente.');
    }

    const job = this.getJobById(data.jobId);
    if (!job) throw new Error('Vaga não encontrada');

    const candidate = this.getUserById(data.candidateId);
    if (!candidate) throw new Error('Candidato não encontrado');

    const newApp: JobApplication = {
      id: `ja-${Date.now()}`,
      jobId: data.jobId,
      jobTitle: job.title,
      companyName: job.companyName,
      candidateId: data.candidateId,
      candidateName: candidate.fullName,
      candidateAvatarUrl: candidate.avatarUrl,
      candidateRole: 'DeMolay',
      coverNote: data.coverNote,
      resumeUrl: data.resumeUrl || candidate.resumeUrl,
      status: 'enviada',
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };

    applications.unshift(newApp);
    saveToStorage(KEYS.APPLICATIONS, applications);

    // Incrementar contador da vaga
    const jobs = this.getJobs();
    const jIndex = jobs.findIndex((j) => j.id === data.jobId);
    if (jIndex !== -1) {
      jobs[jIndex].applicationsCount = (jobs[jIndex].applicationsCount || 0) + 1;
      saveToStorage(KEYS.JOBS, jobs);
    }

    // Notificar o recrutador / maçom
    this.createNotification({
      userId: job.publisherId,
      title: 'Nova Candidatura Recebida',
      message: `${candidate.fullName} se candidatou para a vaga de "${job.title}".`,
      type: 'application',
      link: '/minhas-vagas',
    });

    return newApp;
  },

  updateApplicationStatus(id: string, status: ApplicationStatus): JobApplication {
    const apps = this.getApplications();
    const index = apps.findIndex((a) => a.id === id);
    if (index === -1) throw new Error('Candidatura não encontrada');

    apps[index].status = status;
    apps[index].updatedAt = new Date().toISOString();
    saveToStorage(KEYS.APPLICATIONS, apps);

    // Notificar o candidato sobre mudança de status
    const statusLabels: Record<ApplicationStatus, string> = {
      enviada: 'Enviada',
      visualizada: 'Visualizada pelo recrutador',
      em_analise: 'Em Análise',
      entrevista: 'Convocado para Entrevista',
      aprovado: 'Aprovado no Processo!',
      rejeitado: 'Processo Finalizado',
    };

    this.createNotification({
      userId: apps[index].candidateId,
      title: 'Atualização de Candidatura',
      message: `Sua candidatura para "${apps[index].jobTitle}" foi atualizada para: ${statusLabels[status]}.`,
      type: 'application',
      link: '/minhas-candidaturas',
    });

    return apps[index];
  },

  // --------------------------------------------------------------------------
  // NETWORKING & CONEXÕES
  // --------------------------------------------------------------------------
  getConnections(): Connection[] {
    return getFromStorage<Connection[]>(KEYS.CONNECTIONS, INITIAL_CONNECTIONS);
  },

  getUserConnections(userId: string): {
    connections: UserProfile[];
    receivedRequests: { connection: Connection; user: UserProfile }[];
    sentRequests: { connection: Connection; user: UserProfile }[];
  } {
    const all = this.getConnections();
    const users = this.getUsers();

    const acceptedList = all.filter(
      (c) => c.status === 'accepted' && (c.requesterId === userId || c.addresseeId === userId)
    );

    const connectedUserIds = acceptedList.map((c) =>
      c.requesterId === userId ? c.addresseeId : c.requesterId
    );

    const connections = users.filter((u) => connectedUserIds.includes(u.id));

    const receivedRequests = all
      .filter((c) => c.addresseeId === userId && c.status === 'pending')
      .map((c) => ({
        connection: c,
        user: users.find((u) => u.id === c.requesterId)!,
      }))
      .filter((r) => Boolean(r.user));

    const sentRequests = all
      .filter((c) => c.requesterId === userId && c.status === 'pending')
      .map((c) => ({
        connection: c,
        user: users.find((u) => u.id === c.addresseeId)!,
      }))
      .filter((r) => Boolean(r.user));

    return { connections, receivedRequests, sentRequests };
  },

  getConnectionStatus(userA: string, userB: string): 'none' | 'pending_sent' | 'pending_received' | 'connected' {
    if (userA === userB) return 'none';
    const all = this.getConnections();
    const conn = all.find(
      (c) =>
        (c.requesterId === userA && c.addresseeId === userB) ||
        (c.requesterId === userB && c.addresseeId === userA)
    );

    if (!conn) return 'none';
    if (conn.status === 'accepted') return 'connected';
    if (conn.requesterId === userA) return 'pending_sent';
    return 'pending_received';
  },

  sendConnectionRequest(requesterId: string, addresseeId: string): Connection {
    const all = this.getConnections();
    const existing = all.find(
      (c) =>
        (c.requesterId === requesterId && c.addresseeId === addresseeId) ||
        (c.requesterId === addresseeId && c.addresseeId === requesterId)
    );

    if (existing) {
      if (existing.status === 'accepted') throw new Error('Usuários já estão conectados');
      throw new Error('Já existe uma solicitação de conexão em andamento.');
    }

    const newConn: Connection = {
      id: `cn-${Date.now()}`,
      requesterId,
      addresseeId,
      status: 'pending',
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };

    all.push(newConn);
    saveToStorage(KEYS.CONNECTIONS, all);

    const requester = this.getUserById(requesterId);
    this.createNotification({
      userId: addresseeId,
      title: 'Nova Solicitação de Conexão',
      message: `${requester?.fullName || 'Um membro'} enviou uma solicitação para se conectar com você.`,
      type: 'connection',
      link: '/rede',
    });

    return newConn;
  },

  acceptConnection(connectionId: string): void {
    const all = this.getConnections();
    const index = all.findIndex((c) => c.id === connectionId);
    if (index === -1) return;

    all[index].status = 'accepted';
    all[index].updatedAt = new Date().toISOString();
    saveToStorage(KEYS.CONNECTIONS, all);

    const conn = all[index];
    const accepter = this.getUserById(conn.addresseeId);

    this.createNotification({
      userId: conn.requesterId,
      title: 'Conexão Aceita',
      message: `${accepter?.fullName || 'Um membro'} aceitou sua solicitação de conexão. Vocês agora podem trocar mensagens!`,
      type: 'connection',
      link: `/perfil/${conn.addresseeId}`,
    });
  },

  removeConnection(userA: string, userB: string): void {
    const all = this.getConnections();
    const filtered = all.filter(
      (c) =>
        !(
          (c.requesterId === userA && c.addresseeId === userB) ||
          (c.requesterId === userB && c.addresseeId === userA)
        )
    );
    saveToStorage(KEYS.CONNECTIONS, filtered);
  },

  // --------------------------------------------------------------------------
  // MENSAGENS PRIVADAS
  // --------------------------------------------------------------------------
  getConversations(userId: string): Conversation[] {
    const convs = getFromStorage<Conversation[]>(KEYS.CONVERSATIONS, INITIAL_CONVERSATIONS);
    const messages = this.getMessages();
    const users = this.getUsers();

    return convs
      .filter((c) => c.participantIds.includes(userId))
      .map((c) => {
        const otherId = c.participantIds.find((id) => id !== userId);
        const otherUser = users.find((u) => u.id === otherId);
        const convMessages = messages.filter((m) => m.conversationId === c.id);
        const lastMsg = convMessages[convMessages.length - 1];

        return {
          ...c,
          otherParticipant: otherUser,
          lastMessage: lastMsg,
        };
      })
      .sort((a, b) => new Date(b.updatedAt).getTime() - new Date(a.updatedAt).getTime());
  },

  getMessages(): Message[] {
    return getFromStorage<Message[]>(KEYS.MESSAGES, INITIAL_MESSAGES);
  },

  getConversationMessages(conversationId: string): Message[] {
    return this.getMessages().filter((m) => m.conversationId === conversationId);
  },

  sendMessage(data: {
    senderId: string;
    recipientId: string;
    content: string;
  }): Message {
    const convs = getFromStorage<Conversation[]>(KEYS.CONVERSATIONS, INITIAL_CONVERSATIONS);
    let conv = convs.find(
      (c) =>
        c.participantIds.includes(data.senderId) &&
        c.participantIds.includes(data.recipientId)
    );

    if (!conv) {
      conv = {
        id: `cv-${Date.now()}`,
        participantIds: [data.senderId, data.recipientId],
        updatedAt: new Date().toISOString(),
      };
      convs.push(conv);
    } else {
      conv.updatedAt = new Date().toISOString();
    }
    saveToStorage(KEYS.CONVERSATIONS, convs);

    const messages = this.getMessages();
    const newMsg: Message = {
      id: `ms-${Date.now()}`,
      conversationId: conv.id,
      senderId: data.senderId,
      content: data.content.trim(),
      read: false,
      createdAt: new Date().toISOString(),
    };

    messages.push(newMsg);
    saveToStorage(KEYS.MESSAGES, messages);

    const sender = this.getUserById(data.senderId);
    this.createNotification({
      userId: data.recipientId,
      title: 'Nova Mensagem',
      message: `${sender?.fullName || 'Alguém'}: "${data.content.slice(0, 45)}${data.content.length > 45 ? '...' : ''}"`,
      type: 'message',
      link: '/mensagens',
    });

    return newMsg;
  },

  // --------------------------------------------------------------------------
  // PUBLICAÇÕES & FEED
  // --------------------------------------------------------------------------
  getPosts(): Post[] {
    return getFromStorage<Post[]>(KEYS.POSTS, INITIAL_POSTS);
  },

  createPost(data: Omit<Post, 'id' | 'createdAt'>): Post {
    const posts = this.getPosts();
    const newPost: Post = {
      ...data,
      id: `p-${Date.now()}`,
      createdAt: new Date().toISOString(),
    };
    posts.unshift(newPost);
    saveToStorage(KEYS.POSTS, posts);
    return newPost;
  },

  toggleLikePost(postId: string, userId: string): Post {
    const posts = this.getPosts();
    const post = posts.find((p) => p.id === postId);
    if (!post) throw new Error('Post não encontrado');

    const hasLiked = post.likes.includes(userId);
    if (hasLiked) {
      post.likes = post.likes.filter((id) => id !== userId);
    } else {
      post.likes.push(userId);
    }

    saveToStorage(KEYS.POSTS, posts);
    return post;
  },

  addComment(postId: string, comment: {
    authorId: string;
    authorName: string;
    authorRole: UserRole;
    authorAvatarUrl?: string;
    content: string;
  }): Post {
    const posts = this.getPosts();
    const post = posts.find((p) => p.id === postId);
    if (!post) throw new Error('Post não encontrado');

    const newComment = {
      id: `c-${Date.now()}`,
      postId,
      ...comment,
      createdAt: new Date().toISOString(),
    };

    post.comments.push(newComment);
    saveToStorage(KEYS.POSTS, posts);
    return post;
  },

  // --------------------------------------------------------------------------
  // NOTIFICAÇÕES
  // --------------------------------------------------------------------------
  getNotifications(userId: string): NotificationItem[] {
    const all = getFromStorage<NotificationItem[]>(KEYS.NOTIFICATIONS, INITIAL_NOTIFICATIONS);
    return all.filter((n) => n.userId === userId).sort(
      (a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
    );
  },

  createNotification(notif: Omit<NotificationItem, 'id' | 'read' | 'createdAt'>): void {
    const all = getFromStorage<NotificationItem[]>(KEYS.NOTIFICATIONS, INITIAL_NOTIFICATIONS);
    const newNotif: NotificationItem = {
      ...notif,
      id: `nt-${Date.now()}`,
      read: false,
      createdAt: new Date().toISOString(),
    };
    all.unshift(newNotif);
    saveToStorage(KEYS.NOTIFICATIONS, all);
  },

  markNotificationAsRead(id: string): void {
    const all = getFromStorage<NotificationItem[]>(KEYS.NOTIFICATIONS, INITIAL_NOTIFICATIONS);
    const n = all.find((item) => item.id === id);
    if (n) {
      n.read = true;
      saveToStorage(KEYS.NOTIFICATIONS, all);
    }
  },

  markAllNotificationsAsRead(userId: string): void {
    const all = getFromStorage<NotificationItem[]>(KEYS.NOTIFICATIONS, INITIAL_NOTIFICATIONS);
    all.forEach((n) => {
      if (n.userId === userId) n.read = true;
    });
    saveToStorage(KEYS.NOTIFICATIONS, all);
  },

  // --------------------------------------------------------------------------
  // RESET / REINICIALIZAÇÃO PARA DEMO
  // --------------------------------------------------------------------------
  resetToDefaultSeed(): void {
    safeStorage.setItem(KEYS.USERS, JSON.stringify(INITIAL_USERS));
    safeStorage.setItem(KEYS.CHAPTERS, JSON.stringify(INITIAL_CHAPTERS));
    safeStorage.setItem(KEYS.COMPANIES, JSON.stringify(INITIAL_COMPANIES));
    safeStorage.setItem(KEYS.JOBS, JSON.stringify(INITIAL_JOBS));
    safeStorage.setItem(KEYS.APPLICATIONS, JSON.stringify(INITIAL_APPLICATIONS));
    safeStorage.setItem(KEYS.CONNECTIONS, JSON.stringify(INITIAL_CONNECTIONS));
    safeStorage.setItem(KEYS.CONVERSATIONS, JSON.stringify(INITIAL_CONVERSATIONS));
    safeStorage.setItem(KEYS.MESSAGES, JSON.stringify(INITIAL_MESSAGES));
    safeStorage.setItem(KEYS.POSTS, JSON.stringify(INITIAL_POSTS));
    safeStorage.setItem(KEYS.NOTIFICATIONS, JSON.stringify(INITIAL_NOTIFICATIONS));
    safeStorage.setItem(KEYS.ADMIN_ACTIONS, JSON.stringify(INITIAL_ADMIN_ACTIONS));
    safeStorage.setItem(KEYS.CURRENT_USER_ID, 'd0000000-0000-0000-0000-000000000001');
  },
};
