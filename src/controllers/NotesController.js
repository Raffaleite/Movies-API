const knex = require("../database/knex");

class NotesController {
    async create(request, response) {
        const { title, description, rating, tags } = request.body
        const { user_id } = request.params

        const [note_id] = await knex("movie_notes").insert({
            title,
            description,
            rating,
            user_id
        })

        const tagsInsert = tags.map(name => {
            return {
                note_id,
                name,
                user_id
            }
        })

        await knex("movie_tags").insert(tagsInsert)

        response.json()
    }

    async show(request, response) {
        const { id } = request.params

        const note = await knex("movie_notes").where({ id }).first()
        const tags = await knex("movie_tags").where({ note_id: id }).orderBy("name")

        return response.json({
            ...note,
            tags,
        })
    }

    async delete(request, response) {
        const { id } = request.params

        await knex("movie_notes").where({ id }).delete()

        return response.json()
    }

    async index(request, response) {
        const { title, user_id, tags } = request.query;

        let notes;

        if (tags) {
            const filterTags = tags.split(',').map(tag => tag.trim())
            console.log(filterTags)

            notes = await knex("movie_tags")
                .select([
                    "movie_notes.id",
                    "movie_notes.title",
                    "movie_notes.user_id",
                ])
                .where("movie_notes.user_id", user_id)
                .whereLike("movie_notes.title", `%${title}%`)
                .whereIn("name", filterTags)
                .innerJoin("movie_notes", "movie_notes.id", "movie_tags.note_id")
                .orderBy("movie_notes.title")

        } else { // consulta sem depender das tags - se nao tiver tags
            notes = await knex("movie_notes")
                .where({ user_id })
                .whereLike("title", `%${title}%`) // whereLike - busca por tokens que se parecem e %${title}% é como se falassemos para o banco buscar esta palavra antes e depois, em qualquer parte da palavra
                .orderBy("title")
        }

        const userTags = await knex("movie_tags").where({ user_id })
        const notesWithTags = notes.map(note => {
            const noteTags = userTags.filter(tag => tag.note_id === note.id)

            return{
                ...note,
                tags: noteTags
            }
        })
        return response.json(notesWithTags)

    }
}

module.exports = NotesController;