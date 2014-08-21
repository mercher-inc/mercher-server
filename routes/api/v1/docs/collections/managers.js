module.exports = {
    "id":          "ManagersList",
    "required":    [
        "managers",
        "total"
    ],
    "description": "Managers collection",
    "properties":  {
        "managers": {
            "type":  "array",
            "items": {
                "$ref": "Manager"
            }
        },
        "total":    {
            "type":   "integer",
            "format": "int32"
        }
    }
};
