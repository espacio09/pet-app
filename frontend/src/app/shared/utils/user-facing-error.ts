const HTTP_ERROR_MESSAGES: Record<number, string> = {
  400: "No se pudo procesar la solicitud. Revisa los datos e inténtalo de nuevo.",
  404: "No se encontró la información solicitada. Es posible que ya no esté disponible.",
  500: "Ocurrió un problema en el servidor. Inténtalo de nuevo más tarde.",
};

function getStatusMessage(status: number): string | undefined {
  if (status >= 500) {
    return HTTP_ERROR_MESSAGES[500];
  }

  return HTTP_ERROR_MESSAGES[status];
}

export function getUserFacingErrorMessage(
  error: unknown,
  fallback: string,
): string {
  if (!(error instanceof Error) || !error.message.trim()) {
    return fallback;
  }

  const message = error.message.trim();
  if (/^(?:400\s+)?bad request$/i.test(message)) {
    return HTTP_ERROR_MESSAGES[400];
  }

  if (/^(?:404\s+)?not found$/i.test(message)) {
    return HTTP_ERROR_MESSAGES[404];
  }

  if (/^(?:500\s+)?internal server error$/i.test(message)) {
    return fallback;
  }

  if (/failed to fetch|networkerror|load failed/i.test(message)) {
    return "No se pudo conectar con el servidor. Comprueba tu conexión e inténtalo de nuevo.";
  }

  return message;
}

export async function getUserFacingHttpErrorMessage(
  response: Response,
  fallback: string,
  responseBody?: unknown,
): Promise<string> {
  if (response.status >= 500) {
    return HTTP_ERROR_MESSAGES[500];
  }
  if (response.status === 404) {
    return HTTP_ERROR_MESSAGES[404];
  }

  let body = responseBody;
  if (body === undefined) {
    try {
      body = await response.json();
    } catch {
      body = null;
    }
  }

  if (
    response.status === 400 &&
    typeof body === "object" &&
    body !== null &&
    "message" in body &&
    Array.isArray(body.message)
  ) {
    const validationMessage = body.message
      .filter((message): message is string => typeof message === "string")
      .join(", ");
    return validationMessage || HTTP_ERROR_MESSAGES[400];
  }

  if (response.status === 400) {
    return HTTP_ERROR_MESSAGES[400];
  }

  if (typeof body === "object" && body !== null && "message" in body) {
    const message = body.message;
    const errorMessage = Array.isArray(message)
      ? message.join(", ")
      : typeof message === "string"
        ? message
        : "";

    if (errorMessage.trim()) {
      return getUserFacingErrorMessage(new Error(errorMessage), fallback);
    }
  }

  const statusMessage = getStatusMessage(response.status);
  if (statusMessage) {
    return statusMessage;
  }

  if (response.statusText) {
    return getUserFacingErrorMessage(new Error(response.statusText), fallback);
  }

  return fallback;
}
