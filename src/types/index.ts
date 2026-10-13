export type UserRole = 'demolay' | 'mason' | 'admin';

export type UserStatus = 'pending' | 'approved' | 'rejected' | 'suspended';

export type WorkModel = 'presencial' | 'hibrido' | 'remoto';

export type ContractType = 'clt' | 'pj' | 'estagio' | 'jovem_aprendiz' | 'temporario';

export type JobStatus = 'aberta' | 'pausada' | 'encerrada';

export type ApplicationStatus =
  | 'enviada'
  | 'visualizada'
  | 'em_analise'
  | 'entrevista'
  | 'aprovado'
  | 'rejeitado';

export type ConnectionStatus = 'pending' | 'accepted' | 'rejected';

export type PostType = 'geral' | 'conquista' | 'projeto_capitulo' | 'evento' | 'vaga';

export type NotificationType =
  | 'connection'
  | 'message'
  | 'approval'
  | 'job'
  | 'application'
  | 'system';

export interface BaseProfile {
  id: string;
  email: string;
  fullName: string;
  role: UserRole;
  status: UserStatus;
  verified: boolean;
  avatarUrl?: string;
  bio?: string;
  city: string;
  state: string;
  phone?: string;
  showPhone?: boolean;
  linkedinUrl?: string;
  instagramUrl?: string;
  githubUrl?: string;
  portfolioUrl?: string;
  resumeUrl?: string;
  showResume?: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface DeMolayDetails {
  chapterId?: string;
  chapterName: string;
  orderRank: string; // ex: "DeMolay Ativo", "Sênior DeMolay", "Past Mestre Conselheiro", "Chevalier", "Legionário de Honra"
  cid?: string; // Cadastro DeMolay
  openToWork: boolean;
  interestAreas: string[];
  educationLevel?: string;
  institution?: string;
  course?: string;
  skills: string[];
}

export interface MasonDetails {
  lodgeName: string; // Loja Maçônica
  lodgeObedience?: string; // GOB, GLOMARON, CMSB, COMAB, etc.
  cim?: string; // Cadastro de Identificação Maçônica
  profession: string;
  skills: string[];
}

export interface Experience {
  id: string;
  profileId: string;
  companyName: string;
  role: string;
  startDate: string;
  endDate?: string;
  isCurrent: boolean;
  description?: string;
}

export interface Education {
  id: string;
  profileId: string;
  institution: string;
  degree: string;
  fieldOfStudy: string;
  startYear: number;
  endYear?: number;
}

export interface Project {
  id: string;
  profileId: string;
  title: string;
  description: string;
  url?: string;
  date?: string;
}

export interface UserProfile extends BaseProfile {
  demolayDetails?: DeMolayDetails;
  masonDetails?: MasonDetails;
  experiences?: Experience[];
  education?: Education[];
  projects?: Project[];
}

export interface Chapter {
  id: string;
  name: string;
  number: number;
  city: string;
  state: string;
  logoUrl?: string;
  bannerUrl?: string;
  history?: string;
  masterCouncilor?: string;
  contactEmail?: string;
  contactPhone?: string;
  instagram?: string;
  activeMembersCount?: number;
  createdAt: string;
}

export interface Company {
  id: string;
  ownerId: string; // ID do Maçom proprietário
  ownerName?: string;
  name: string;
  logoUrl?: string;
  bannerUrl?: string;
  segment: string;
  city: string;
  state: string;
  website?: string;
  instagram?: string;
  whatsapp?: string;
  description: string;
  createdAt: string;
}

export interface Job {
  id: string;
  companyId: string;
  companyName: string;
  companyLogoUrl?: string;
  publisherId: string; // Maçom que publicou
  publisherName?: string;
  title: string;
  description: string;
  city: string;
  state: string;
  workModel: WorkModel;
  contractType: ContractType;
  salaryMin?: number;
  salaryMax?: number;
  salaryNegotiable: boolean;
  educationRequirement?: string;
  experienceRequirement?: string;
  requiredSkills: string[];
  benefits: string[];
  status: JobStatus;
  deadline?: string;
  createdAt: string;
  applicationsCount?: number;
}

export interface JobApplication {
  id: string;
  jobId: string;
  jobTitle?: string;
  companyName?: string;
  candidateId: string;
  candidateName: string;
  candidateAvatarUrl?: string;
  candidateRole: string;
  coverNote?: string;
  resumeUrl?: string;
  status: ApplicationStatus;
  createdAt: string;
  updatedAt: string;
}

export interface Connection {
  id: string;
  requesterId: string;
  addresseeId: string;
  status: ConnectionStatus;
  createdAt: string;
  updatedAt: string;
  otherUser?: UserProfile;
}

export interface Message {
  id: string;
  conversationId: string;
  senderId: string;
  content: string;
  read: boolean;
  createdAt: string;
}

export interface Conversation {
  id: string;
  participantIds: string[];
  lastMessage?: Message;
  updatedAt: string;
  otherParticipant?: UserProfile;
}

export interface PostComment {
  id: string;
  postId: string;
  authorId: string;
  authorName: string;
  authorAvatarUrl?: string;
  authorRole: UserRole;
  content: string;
  createdAt: string;
}

export interface Post {
  id: string;
  authorId: string;
  authorName: string;
  authorAvatarUrl?: string;
  authorRole: UserRole;
  authorVerified: boolean;
  chapterId?: string;
  chapterName?: string;
  companyId?: string;
  companyName?: string;
  type: PostType;
  title?: string;
  content: string;
  imageUrl?: string;
  likes: string[]; // userIds que curtiram
  comments: PostComment[];
  createdAt: string;
}

export interface NotificationItem {
  id: string;
  userId: string;
  title: string;
  message: string;
  type: NotificationType;
  link?: string;
  read: boolean;
  createdAt: string;
}

export interface AdminAction {
  id: string;
  adminId: string;
  adminName: string;
  targetType: 'user' | 'company' | 'job' | 'post' | 'chapter';
  targetId: string;
  targetName: string;
  action: 'approve' | 'reject' | 'suspend' | 'activate' | 'delete';
  reason?: string;
  createdAt: string;
}

export interface SystemStats {
  totalUsers: number;
  demolaysCount: number;
  masonsCount: number;
  pendingUsersCount: number;
  companiesCount: number;
  chaptersCount: number;
  activeJobsCount: number;
  applicationsCount: number;
  postsCount: number;
}
