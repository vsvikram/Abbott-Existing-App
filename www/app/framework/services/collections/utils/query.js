(function () {
    function query(utils) {
        var Query = function (soup) {
            this.soup = soup;
            this.query = '';
            this.isWhereUsed = false;
            this.isConditionUsed = false;
        };

        Query.TRUE = utils.isIos() ? "1" : "'true'";

        Query.FALSE = utils.isIos() ? "0" : "'false'";

        Query.ALL = '_soup';

        Query.AND = 'AND';

        Query.OR = 'OR';

        Query.IN = 'IN';

        Query.NOT_IN = 'NOT IN';

        Query.EQ = '=';

        Query.NE = '!=';

        Query.GR = '>';

        Query.LR = '<';

        Query.GRE = '>=';

        Query.LRE = '<=';

        Query.ASC = 'ASC';

        Query.DESC = 'DESC';

        Query.IS = 'IS';

        Query.ISNT = 'IS NOT';

        Query.prototype.customQuery = function (queryString) {
            this.query += queryString;
            if (this.query.indexOf(" WHERE ") > 0) {
                this.isWhereUsed = true;
            }
            return this;
        };

        Query.prototype.selectFrom = function (soup, fields) {
            var selectConditions;
            this.soup = soup;
            if (fields == null) {
                fields = Query.ALL;
            }
            if (fields === Query.ALL) {
                this.query += "SELECT {" + this.soup + ":" + fields + "} FROM {" + this.soup + "}";
                return this;
            } else {
                selectConditions = fields.map((function (_this) {
                    return function (field) {
                        return "{" + _this.soup + ":" + field + "}";
                    };
                })(this));
                this.query += "SELECT " + selectConditions.join(',') + (" FROM {" + this.soup + "}");
                return this;
            }
        };

        Query.prototype.selectCountFrom = function (soup) {
            this.soup = soup;
            this.query += "SELECT COALESCE(count(*), 0) FROM {" + this.soup + "}";
            return this;
        };

        Query.prototype.selectMaxFrom = function (soup, field) {
            this.soup = soup;
            if (field == null) {
                field = 'Id';
            }
            this.query += "SELECT COALESCE(max({" + this.soup + ":" + field + "}), 0) FROM {" + this.soup + "}";
            return this;
        };

        Query.prototype.where = function (fieldsValues, eqCondition, joinWith) {
            var field, value, whereConditions;
            if (eqCondition == null) {
                eqCondition = Query.EQ;
            }
            if (joinWith == null) {
                joinWith = Query.AND;
            }
            whereConditions = (function () {
                var results;
                results = [];
                for (field in fieldsValues) {
                    value = fieldsValues[field];
                    results.push("{" + this.soup + ":" + field + "} " + eqCondition + " " + (Query.valueOf(value)));
                }
                return results;
            }).call(this);
            this.query += this._whereCondition() + whereConditions.join(" " + joinWith + " ");
            this.isConditionUsed = false;
            return this;
        };

        Query.prototype.whereNull = function (fieldName) {
            this.query += (this._whereCondition()) + "{" + this.soup + ":" + fieldName + "} " + Query.IS + " NULL";
            this.isConditionUsed = false;
            return this;
        };

        Query.prototype.whereNotNull = function (fieldName) {
            this.query += (this._whereCondition()) + "{" + this.soup + ":" + fieldName + "} " + Query.ISNT + " NULL";
            this.isConditionUsed = false;
            return this;
        };

        Query.prototype.whereLike = function (fieldsValues, joinWith) {
            var field, likeConditions, value;
            if (joinWith == null) {
                joinWith = Query.OR;
            }
            likeConditions = (function () {
                var results;
                results = [];
                for (field in fieldsValues) {
                    value = fieldsValues[field];
                    results.push("{" + this.soup + ":" + field + "} LIKE '%" + (Query._ecranisedValue(value)) + "%'");
                }
                return results;
            }).call(this);
            this.query += this._whereCondition() + '(' + likeConditions.join(" " + joinWith + " ") + ')';
            this.isConditionUsed = false;
            return this;
        };

        Query.prototype.whereIn = function (field, values) {
            values = values.map(Query.valueOf);
            this.query += this._whereCondition() + (" {" + this.soup + ":" + field + "} " + Query.IN + " (" + (values.join(', ')) + ")");
            return this;
        };

        Query.prototype.whereNotIn = function (field, values) {
            values = values.map(Query.valueOf);
            this.query += this._whereCondition() + (" {" + this.soup + ":" + field + "} " + Query.NOT_IN + " (" + (values.join(', ')) + ")");
            return this;
        };

        Query.prototype.orderBy = function (fields, order) {
            var orderConditions;
            if (order == null) {
                order = Query.ASC;
            }
            orderConditions = fields.map((function (_this) {
                return function (field) {
                    if (utils.isIos()) {
                        return "{" + _this.soup + ":" + field + "} COLLATE NOCASE " + order;
                    } else {
                        return "{" + _this.soup + ":" + field + "} = 'null' " + order + ", {" + _this.soup + ":" + field + "} COLLATE NOCASE " + order;
                    }
                };
            })(this));
            this.query += ' ORDER BY ' + orderConditions.join(',');
            return this;
        };

        Query.prototype.limit = function (count) {
            this.query += " LIMIT " + count;
            return this;
        };

        Query.prototype.and = function () {
            this.query += this._andQuery();
            return this;
        };

        Query.prototype._andQuery = function () {
            this.isConditionUsed = true;
            return " " + Query.AND + " ";
        };

        Query.prototype.or = function () {
            this.query += " " + Query.OR + " ";
            this.isConditionUsed = true;
            return this;
        };

        Query.valueOf = function (value) {
            switch (value) {
                case true:
                    return Query.TRUE;
                case false:
                    return Query.FALSE;
                default:
                    return "'" + (Query._ecranisedValue(value)) + "'";
            }
        };

        Query._ecranisedValue = function (value) {
            if (typeof value === 'string') {
                return value.replace('\'', '\'\'');
            } else {
                return value;
            }
        };

        Query.prototype._whereCondition = function () {
            if (this.isWhereUsed) {
                if (this.isConditionUsed) {
                    return ' ';
                } else {
                    return this._andQuery();
                }
            } else {
                this.isWhereUsed = true;
                return ' WHERE ';
            }
        };

        Query.prototype.toString = function () {
            return this.query;
        };

        return Query;
    }

    abbottApp.factory('query', [
      'utils',
      query
    ]);
})();