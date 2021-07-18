const nav = ['./daily', './course', './open', './create']

module.exports = nav.map(value => require(value))
