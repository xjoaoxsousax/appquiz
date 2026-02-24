export interface Opcao {
    letra: string;
    texto: string;
    correta: boolean;
}

export interface Questao {
    numero: string;
    url: string;
    pergunta: string;
    imagem: string;
    imagemUrl?: string; // Added image link
    opcoes: Opcao[];
    letraCorreta: string;
    temaLabel?: string; // To track which theme a question came from in random mode
}

export interface QuizData {
    tema: string;
    slug: string;
    total: number;
    questoes: Questao[];
}

const THEMES_MAP: Record<string, string> = {
    'cedencia-passagem': 'tema_cedencia-passagem.json',
    'circulacao-seguranca': 'tema_circulacao-seguranca-veiculos-missao-urgente-socorro.json',
    'classificacao-veiculos': 'tema_classificacao-constituintes-inspeccoes-pesos-dimensoes-proteccao-ambiente-equipamentos-seguranca-acidente.json',
    'estado-fisico-condutor': 'tema_estado-fisico-condutor-alcool-drogas-medicamentos-sinais-obrigacao.json',
    'iluminacao-carga': 'tema_iluminacao-passageiros-carga-conducao-defensiva-peoes.json',
    'outras-manobras': 'tema_outras-manobras.json',
    'paragem-estacionamento': 'tema_paragem-estacionamento-cruzamento-veiculos.json',
    'sinais-indicacao': 'tema_sinais-indicacao.json',
    'sinais-perigo': 'tema_sinais-perigo.json',
    'sinais-prescricao': 'tema_sinais-prescricao-especifica-sinais-cedencia-passagem.json',
    'sinais-proibicao': 'tema_sinais-proibicao.json',
    'sinalizacao-luminosa': 'tema_sinalizacao-luminosa-marcas-pavimento-outra-sinalizacao.json',
    'titulos-conducao': 'tema_titulos-conducao-obtencao-revalidacao-responsabilidade-civil-criminal-ordenacoes-cassacao.json',
    'ultrapassagem': 'tema_ultrapassagem.json',
    'velocidade': 'tema_velocidade.json',
    'vias-transito': 'tema_vias-transito-condicoes-ambientais-adversas.json',
};

export const getAllThemes = () => {
    return Object.keys(THEMES_MAP).map(slug => ({
        slug,
        label: slug.replace(/-/g, ' ').replace(/\b\w/g, l => l.toUpperCase())
    }));
};

export const getQuizDataBySlug = async (slug: string): Promise<QuizData> => {
    const filename = THEMES_MAP[slug];
    if (!filename) throw new Error('Theme not found');
    const data = await import(`./${filename}`);
    return data.default || data;
};

export const getRandomQuestions = async (count: number = 30): Promise<Questao[]> => {
    // Load all themes and pick random questions
    const slugs = Object.keys(THEMES_MAP);
    const allQuestions: Questao[] = [];

    for (const slug of slugs) {
        const data = await getQuizDataBySlug(slug);
        const mappedQuestions = data.questoes.map(q => ({ ...q, temaLabel: data.tema }));
        allQuestions.push(...mappedQuestions);
    }

    const shuffled = [...allQuestions].sort(() => 0.5 - Math.random());
    return shuffled.slice(0, count);
};

// FAVORITES / WRONG QUESTIONS SYSTEM
const FAVORITES_KEY = 'quiz_failed_questions';

export const saveToFavorites = (questao: Questao) => {
    if (typeof window === 'undefined') return;
    const favorites = getFavorites();
    const exists = favorites.find(q => q.numero === questao.numero);
    if (!exists) {
        favorites.push(questao);
        localStorage.setItem(FAVORITES_KEY, JSON.stringify(favorites));
    }
};

export const getFavorites = (): Questao[] => {
    if (typeof window === 'undefined') return [];
    const stored = localStorage.getItem(FAVORITES_KEY);
    return stored ? JSON.parse(stored) : [];
};

export const clearFavorites = () => {
    if (typeof window === 'undefined') return;
    localStorage.removeItem(FAVORITES_KEY);
};

export const removeFromFavorites = (numero: string) => {
    if (typeof window === 'undefined') return;
    const favorites = getFavorites();
    const updated = favorites.filter(q => q.numero !== numero);
    localStorage.setItem(FAVORITES_KEY, JSON.stringify(updated));
};

