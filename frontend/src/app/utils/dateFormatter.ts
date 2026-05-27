import { format, isValid, parseISO } from 'date-fns';
import { ptBR } from 'date-fns/locale';

const FALLBACK_DATE_LABEL = 'Data indisponível';

/**
 * Constrói um objeto Date a partir de partes numéricas, validando se a data é real.
 */
const buildDateFromParts = (
  year: number,
  month: number,
  day: number,
  hour = 0,
  minute = 0,
  second = 0
) => {
  try {
    const date = new Date(year, month - 1, day, hour, minute, second);
    if (!isValid(date)) return null;

    // Verificação extra para evitar que o JS "corrija" datas inexistentes (ex: 31/04 -> 01/05)
    if (
      date.getFullYear() !== year ||
      date.getMonth() !== month - 1 ||
      date.getDate() !== day
    ) {
      return null;
    }

    return date;
  } catch {
    return null;
  }
};

/**
 * Tenta parsear uma data vinda do backend em múltiplos formatos comuns no Java/Spring.
 */
export const parseBackendDate = (value?: string | null): Date | null => {
  if (!value) return null;

  const trimmed = value.trim();
  if (!trimmed) return null;

  // Se for apenas um horário (HH:mm:ss), não é uma data completa
  if (/^\d{2}:\d{2}(:\d{2})?$/.test(trimmed)) {
    return null;
  }

  // 1. Tentar Formato Brasileiro: dd/MM/yyyy ou dd/MM/yyyy HH:mm:ss
  const brMatch = trimmed.match(
    /^(\d{2})\/(\d{2})\/(\d{4})(?:[ T](\d{2}):(\d{2})(?::(\d{2}))?)?/
  );
  if (brMatch) {
    const [, day, month, year, hour, minute, second] = brMatch;
    const parsed = buildDateFromParts(
      Number(year),
      Number(month),
      Number(day),
      Number(hour ?? 0),
      Number(minute ?? 0),
      Number(second ?? 0)
    );
    if (parsed) return parsed;
  }

  // 2. Tentar Formato ISO (YYYY-MM-DD...)
  if (/^\d{4}-\d{2}-\d{2}/.test(trimmed)) {
    try {
      const isoValue = trimmed.includes('T') ? trimmed : `${trimmed}T00:00:00`;
      const parsed = parseISO(isoValue);
      if (isValid(parsed)) return parsed;
    } catch {
      // continua
    }
  }

  // 3. Fallback genérico do construtor Date
  try {
    const fallback = new Date(trimmed);
    return isValid(fallback) ? fallback : null;
  } catch {
    return null;
  }
};

/**
 * Formata uma data de forma segura, nunca disparando erro que cause tela branca.
 * @param value Valor da data (string do backend ou Date)
 * @param formatStr String de formatação do date-fns
 * @param fallback Label de fallback
 */
export const formatSafe = (
  value?: string | Date | null,
  formatStr: string = 'dd/MM/yyyy',
  fallback: string = FALLBACK_DATE_LABEL
): string => {
  try {
    if (!value) return fallback;
    
    let dateObj: Date | null = null;
    
    if (value instanceof Date) {
      dateObj = value;
    } else {
      dateObj = parseBackendDate(value);
    }

    if (!dateObj || !isValid(dateObj)) {
      return fallback;
    }

    return format(dateObj, formatStr, { locale: ptBR });
  } catch (error) {
    console.error('Erro ao formatar data:', error, value);
    return fallback;
  }
};

/**
 * Atalho para data longa: "segunda-feira, 26 de maio de 2026"
 */
export const formatDateLong = (
  value?: string | null,
  fallback: string = FALLBACK_DATE_LABEL
) => {
  return formatSafe(value, "EEEE, dd 'de' MMMM 'de' yyyy", fallback);
};

/**
 * Atalho para data curta: "26/05/2026"
 */
export const formatDateShort = (
  value?: string | null,
  fallback: string = FALLBACK_DATE_LABEL
) => {
  return formatSafe(value, 'dd/MM/yyyy', fallback);
};

/**
 * Retorna o valor numérico para ordenação, priorizando datas válidas.
 */
export const getDateSortValue = (value?: string | null) => {
  const date = parseBackendDate(value);
  return date ? date.getTime() : Number.MAX_SAFE_INTEGER;
};
