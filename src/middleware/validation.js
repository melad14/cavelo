
export const validation = (schema) => {
    return (req, res, next) => {
        let inputs = { ...req.body, ...req.params, ...req.query }
        let { error } = schema.validate(inputs, { abortEarly: false })

        if (error) {
            console.log('error',error);
            let errors = error.details.map(err => err.message)
            console.log('errorsss',errors);
            res.json(errors)

        } else {
            next()
        }

    }

}