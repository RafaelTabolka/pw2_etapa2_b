const { DataTypes } = require('sequelize')

const db = require('../db/conn')

const User = require('../models/User')

const Thought = db.define('THOUGHTS', {
    title: {
        type: DataTypes.STRING,
        allowNull: false
    }
})

Thoughts.belongsTo(User)
User.hasMany(Thought)