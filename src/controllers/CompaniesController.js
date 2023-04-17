const knex = require("../database/knex");

class CompaniesController {
  async create(request, response) {
    const { name, cnpj, address } = request.body;

    // Verifica se algum campo está vazio
    if (!name || !cnpj || !address) {
      return response.status(400).json({ message: "Por favor, preencha todos os campos" });
    }

    // Verifica se já existe uma empresa com o mesmo nome ou cnpj
    const companyExists = await knex("companies").where({ name }).orWhere({ cnpj }).first();

    if (companyExists) {
      return response.status(400).json({ message: "Já existe uma empresa com esse nome ou cnpj" });
    }

    const companyId = await knex("companies").insert({ name, cnpj, address });

    return response.json({ message: "Empresa criada com sucesso", company: { name, cnpj, address, id: companyId[0] } });
  }

  async update(request, response) {
    const { id } = request.params;
    const { name, cnpj, address } = request.body;

    // Verifica se os campos não estão vazios
    if (!name || !cnpj || !address) {
      return response.status(400).json({ error: "All fields are required" });
    }

    // Verifica se o registro existe na tabela
    const companyExists = await knex("companies").where({ id }).first();
    if (!companyExists) {
      return response.status(404).json({ error: "Company not found" });
    }

    // Verifica se já existe outra empresa com o mesmo nome ou CNPJ
    const companyWithSameName = await knex("companies")
      .where({ name })
      .andWhereNot({ id })
      .first();
    if (companyWithSameName) {
      return response.status(409).json({ error: "Company name already exists" });
    }
    const companyWithSameCnpj = await knex("companies")
      .where({ cnpj })
      .andWhereNot({ id })
      .first();
    if (companyWithSameCnpj) {
      return response.status(409).json({ error: "Company CNPJ already exists" });
    }

    // Atualiza os dados da empresa
    await knex("companies").where({ id }).update({ name, cnpj, address });

    // Retorna a empresa atualizada
    const updatedCompany = await knex("companies").where({ id }).first();
    return response.json(updatedCompany);
  }

  async index(request, response) {
    const { name, address, cnpj } = request.query;

    let companies;

    if (name) {
      companies = await knex('companies')
        .where('name', 'like', `%${name}%`)
        .select('*');
    } else if (address) {
      companies = await knex('companies')
        .where('address', 'like', `%${address}%`)
        .select('*');
    } else if (cnpj) {
      companies = await knex('companies')
        .where('cnpj', 'like', `%${cnpj}%`)
        .select('*');
    } else {
      companies = await knex("companies").select("*");
    }

    return response.json(companies);
  }

  async delete(request, response) {
    const { id } = request.params;

    const deleted = await knex("companies").where({ id }).del();

    if (!deleted) {
      return response.status(404).json({ error: "Company not found." });
    }

    return response.status(204).send();
  }
}

module.exports = CompaniesController;