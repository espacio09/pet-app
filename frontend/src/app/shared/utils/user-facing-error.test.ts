import { describe, expect, it } from "vitest";
import {
  getUserFacingErrorMessage,
  getUserFacingHttpErrorMessage,
} from "./user-facing-error";

describe("getUserFacingHttpErrorMessage", () => {
  it.each([
    [
      400,
      "No se pudo procesar la solicitud. Revisa los datos e inténtalo de nuevo.",
    ],
    [
      404,
      "No se encontró la información solicitada. Es posible que ya no esté disponible.",
    ],
    [
      500,
      "Ocurrió un problema en el servidor. Inténtalo de nuevo más tarde.",
    ],
    [
      503,
      "Ocurrió un problema en el servidor. Inténtalo de nuevo más tarde.",
    ],
  ])("returns a user-friendly message for HTTP %i", async (status, expected) => {
    const response = new Response(
      JSON.stringify({ message: "Internal server stack or database details" }),
      { status },
    );

    await expect(
      getUserFacingHttpErrorMessage(response, "Fallback message"),
    ).resolves.toBe(expected);
  });

  it("uses a fallback when a response has no user-facing message", async () => {
    const response = new Response(null, { status: 418 });

    await expect(
      getUserFacingHttpErrorMessage(response, "Fallback message"),
    ).resolves.toBe("Fallback message");
  });

  it("explains when the running backend does not have the appointment update route", async () => {
    const response = new Response(
      JSON.stringify({
        message: "Cannot PATCH /appointments/12",
        error: "Not Found",
        statusCode: 404,
      }),
      { status: 404 },
    );

    await expect(
      getUserFacingHttpErrorMessage(response, "Fallback message"),
    ).resolves.toBe(
      "El backend no reconoce la ruta para actualizar citas. Reinícialo con la versión actual e inténtalo de nuevo.",
    );
  });

  it("explains when the appointment no longer exists", async () => {
    const response = new Response(
      JSON.stringify({
        message: "Cita 12 no encontrada.",
        error: "Not Found",
        statusCode: 404,
      }),
      { status: 404 },
    );

    await expect(
      getUserFacingHttpErrorMessage(response, "Fallback message"),
    ).resolves.toBe(
      "La cita ya no existe en el servidor. Recarga la lista e inténtalo de nuevo.",
    );
  });

  it("shows validation details returned by the server for HTTP 400", async () => {
    const response = new Response(
      JSON.stringify({
        message: ["property phone should not exist"],
        error: "Bad Request",
        statusCode: 400,
      }),
      { status: 400 },
    );

    await expect(
      getUserFacingHttpErrorMessage(response, "Fallback message"),
    ).resolves.toBe("property phone should not exist");
  });
});

describe("getUserFacingErrorMessage", () => {
  it.each([
    ["Bad Request", "No se pudo procesar la solicitud. Revisa los datos e inténtalo de nuevo."],
    [
      "Not Found",
      "No se encontró la información solicitada. Es posible que ya no esté disponible.",
    ],
    [
      "Internal server error",
      "Fallback message",
    ],
  ])("does not show system messages such as %s", (message, expected) => {
    expect(getUserFacingErrorMessage(new Error(message), "Fallback message")).toBe(
      expected,
    );
  });
});
