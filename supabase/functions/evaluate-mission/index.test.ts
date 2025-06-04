// supabase/functions/evaluate-mission/index.test.ts

import {
  validarCorpoRequisicao,
  obterIPReal,
  lerBodyJSON,
} from "./index.ts";
import {
  assertEquals,
  assert,
} from "https://deno.land/std@0.168.0/testing/asserts.ts";

Deno.test("validarCorpoRequisicao aceita entradas válidas", () => {
  const res = validarCorpoRequisicao({
    missionPrompt: "Exemplo de missão",
    userResponse: "Minha resposta",
  });
  assert(res.valid);
});

Deno.test("validarCorpoRequisicao rejeita missionPrompt vazio", () => {
  const res = validarCorpoRequisicao({
    missionPrompt: "",
    userResponse: "Minha resposta",
  });
  assertEquals(res.valid, false);
});

Deno.test("validarCorpoRequisicao rejeita userResponse vazio", () => {
  const res = validarCorpoRequisicao({
    missionPrompt: "Missão",
    userResponse: "",
  });
  assertEquals(res.valid, false);
});

Deno.test("obterIPReal retorna IP correto do header x-forwarded-for", () => {
  const ip = "1.2.3.4";
  const req = new Request("http://localhost", {
    headers: { "x-forwarded-for": ip },
  });
  assertEquals(obterIPReal(req), ip);
});

// Teste de leitura do body (exemplo simplificado)
Deno.test("lerBodyJSON retorna objeto JSON válido", async () => {
  const obj = { a: 1, b: "2" };
  const req = new Request("http://localhost", {
    method: "POST",
    body: JSON.stringify(obj),
  });
  const res = await lerBodyJSON(req, 1024);
  assertEquals(res, obj);
});
