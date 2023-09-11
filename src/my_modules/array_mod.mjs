const modification = {
    valueBykey: function (array, key) {
        let res = [];
        for (let i = 0; i < array.length; i++) {
            res.push(array[i][key]);
        }
        return res;
    },
    objectBykey: function (array, key) {
        let result = {};
        for (let i = 0; i < array.length; i++) {
            result[array[i][key]] = array[i];
        }
        return result;
    },
}

export const valueBykey = modification.valueBykey;
export const objectBykey = modification.objectBykey;