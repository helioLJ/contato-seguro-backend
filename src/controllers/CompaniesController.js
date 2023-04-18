const knex = require("../database/knex");
const AppError = require("../utils/AppError");

class CompaniesController {
  async create(request, response) {
    const { name, cnpj, address } = request.body;

    // Verifica se algum campo está vazio
    if (!name || !cnpj || !address) {
      throw new AppError("Por favor, preencha todos os campos.", 400)
    }

    // Verifica se já existe uma empresa com o mesmo nome ou cnpj
    const companyExists = await knex("companies").where({ name }).orWhere({ cnpj }).first();

    if (companyExists) {
      throw new AppError("Já existe uma empresa com esse nome ou CNPJ.", 400)
    }

    const companyId = await knex("companies").insert({ name, cnpj, address });

    return response.json({ message: "Empresa criada com sucesso", company: { name, cnpj, address, id: companyId[0] } });
  }

  async update(request, response) {
    const { id } = request.params;
    const { name, cnpj, address } = request.body;

    // Verifica se os campos não estão vazios
    if (!name || !cnpj || !address) {
      throw new AppError("Já existe uma empresa com esse nome ou CNPJ.", 400)
    }

    // Verifica se o registro existe na tabela
    const companyExists = await knex("companies").where({ id }).first();
    if (!companyExists) {
      throw new AppError("Empresa não encontrada.", 404)
    }

    // Verifica se já existe outra empresa com o mesmo nome ou CNPJ
    const companyWithSameName = await knex("companies")
      .where({ name })
      .andWhereNot({ id })
      .first();
    if (companyWithSameName) {
      throw new AppError("Nome de empresa já cadastrado.", 409)
    }
    const companyWithSameCnpj = await knex("companies")
      .where({ cnpj })
      .andWhereNot({ id })
      .first();
    if (companyWithSameCnpj) {
      throw new AppError("CNPJ de empresa já cadastrado.", 409)
    }

    // Atualiza os dados da empresa
    const now = new Date();
    const formattedNow = now.toISOString().replace('T', ' ').substr(0, 19);
    await knex("companies").where({ id }).update({ name, cnpj, address, updated_at: formattedNow });

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
        .orderBy('updated_at', 'desc')
        .select('*');
    } else if (address) {
      companies = await knex('companies')
        .where('address', 'like', `%${address}%`)
        .orderBy('updated_at', 'desc')
        .select('*');
    } else if (cnpj) {
      companies = await knex('companies')
        .where('cnpj', 'like', `%${cnpj}%`)
        .orderBy('updated_at', 'desc')
        .select('*');
    } else {
      companies = await knex("companies").orderBy('updated_at', 'desc').select("*");
    }

    return response.json(companies);
  }


  async delete(request, response) {
    const { id } = request.params;

    const deleted = await knex("companies").where({ id }).del();

    if (!deleted) {
      throw new AppError("Empresa não encontrada.", 404)
    }

    return response.status(204).send();
  }
}

module.exports = CompaniesController;