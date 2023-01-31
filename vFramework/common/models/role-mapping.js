var vframe = require('../../lib/vframe');
/**
 * The `RoleMapping` model extends from the built in `vframe.Model` type.
 *
 * @property {String} id Generated ID.
 * @property {String} name Name of the role.
 * @property {String} Description Text description.
 *
 * @class RoleMapping
 * @inherits {PersistedModel}
 */
module.exports = function(RoleMapping) {
    // Principal types
    RoleMapping.USER = 'USER';
    RoleMapping.APP = RoleMapping.APPLICATION = 'APP';
    RoleMapping.ROLE = 'ROLE';
    
    
    /**
     * Get the application principal
     * @callback {Function} callback
     * @param {Error} err
     * @param {Application} application
     */
    RoleMapping.prototype.application = function (callback) {
        if (this.principalType === RoleMapping.APPLICATION) {
            var applicationModel = this.constructor.Application
                    || vframe.getModelByType(vframe.Application);
            applicationModel.findById(this.principalId, callback);
        } else {
            process.nextTick(function () {
                callback && callback(null, null);
            });
        }
    };
    
    
    /**
     * Get the user principal
     * @callback {Function} callback
     * @param {Error} err
     * @param {User} user
     */
    RoleMapping.prototype.user = function (callback) {
        if (this.principalType === RoleMapping.USER) {
            var userModel = this.constructor.User
                    || vframe.getModelByType(vframe.User);
            userModel.findById(this.principalId, callback);
        } else {
            process.nextTick(function () {
                callback && callback(null, null);
            });
        }
    };
    
    
    /**
     * Get the child role principal
     * @callback {Function} callback
     * @param {Error} err
     * @param {User} childUser
     */
    RoleMapping.prototype.childRole = function (callback) {
        if (this.principalType === RoleMapping.ROLE) {
            var roleModel = this.constructor.Role ||
                    vframe.getModelByType(vframe.Role);
            roleModel.findById(this.principalId, callback);
        } else {
            process.nextTick(function () {
                callback && callback(null, null);
            });
        }
    };
};
