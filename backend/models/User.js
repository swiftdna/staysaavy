const etsy = (sequelize, type) => {
    return sequelize.define('user', {
    uname:{
        type: String,
        required: true
    },
    email:{
        type:String,
        required: true,
        allowNull: false
    },
    password:{
        type : String,
        required: true
    }
});
};


module.exports = etsy;