const form = document.querySelector("#cep-form");
const cepInput = document.querySelector("#cep");
const button = document.querySelector("#submit-button");
const status = document.querySelector("#status");
const result = document.querySelector("#result");

cepInput.addEventListener("input", (event) => {
  const digits = event.target.value.replace(/\D/g, "").slice(0, 8);
  event.target.value = digits.length > 5
    ? `${digits.slice(0, 5)}-${digits.slice(5)}`
    : digits;
});

form.addEventListener("submit", async (event) => {
  event.preventDefault();
  const cep = cepInput.value.replace(/\D/g, "");

  result.classList.remove("visible");
  status.className = "";
  if (cep.length !== 8) {
    status.textContent = "Digite um CEP válido com 8 números.";
    status.className = "error";
    cepInput.focus();
    return;
  }

  button.disabled = true;
  button.textContent = "Consultando...";
  status.textContent = "Buscando endereço...";

  try {
    const response = await fetch(`https://viacep.com.br/ws/${cep}/json/`);
    if (!response.ok) throw new Error("Falha na comunicação com o serviço.");
    const data = await response.json();
    if (data.erro) throw new Error("CEP não encontrado. Confira os números e tente novamente.");

    ["logradouro", "bairro", "localidade", "uf", "complemento"].forEach((field) => {
      document.querySelector(`#${field}`).textContent = data[field] || "Não informado";
    });
    document.querySelector("#cep-result").textContent = data.cep || cepInput.value;
    result.classList.add("visible");
    status.textContent = "Consulta concluída.";
    status.className = "success";
  } catch (error) {
    status.textContent = error.message || "Não foi possível consultar o CEP agora.";
    status.className = "error";
  } finally {
    button.disabled = false;
    button.textContent = "Consultar CEP";
  }
});
