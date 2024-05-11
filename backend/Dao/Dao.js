// Filename: dao.js

class Dao {
    constructor(model) {
        this.model = model;
    }

    getAll() {
        return this.model.find().exec();
    }

    getById(id) {
        return this.model.findById(id).exec();
    }

    save(data) {
        const instance = new this.model(data);
        return instance.save();
    }

    update(id, data) {
        return this.model.findByIdAndUpdate(id, data, { new: true }).exec();
    }

    delete(id) {
        return this.model.findByIdAndDelete(id).exec();
    }
    count() {
        return this.model.countDocuments().exec();
    }
}

export default Dao;
