const validate = (schema) => (req, res, next) => {

    const { error } = schema.validate(req.body, {
        abortEarly: false
    });

    if (error) {

        const messages = error.details.map(
            (detail) => detail.message
        );

        console.log("VALIDATION ERRORS:", messages);
        console.log("BODY RECEIVED:", req.body);

        return res.status(400).json({
            message: "Validation error",
            errors: messages
        });
    }

    next();
};

export default validate;