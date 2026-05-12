/** Тело ошибки для API: и `message`, и `error` — фронт ожидает `error` в reject. */
export default function apiErrorBody(text: string): { message: string; error: string } {
  return { message: text, error: text };
}
