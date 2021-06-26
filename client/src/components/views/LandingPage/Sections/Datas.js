const continents = [
    {
        "_id": 1,
        "name":"Africa"
    },
    {
        "_id": 2,
        "name":"Europe"
    },
    {
        "_id": 3,
        "name":"Asia"
    },
    {
        "_id": 4,
        "name":"North America"
    },
    {
        "_id": 5,
        "name":"South America"
    },
    {
        "_id": 6,
        "name":"Australia"
    },
    {
        "_id": 7,
        "name":"Antarctica"
    }
]

const price = [
    {
        "_id": 0,
        "name": "Any",
        "array": []
    },
    {
        "_id": 1,
        "name": "$0 to $199",
        "array": [0, 199]
    },
    {
        "_id": 2,
        "name": "$200 to $399",
        "array": [200, 399]
    },
    {
        "_id": 3,
        "name": "$400 to $599",
        "array": [400, 599]
    },
    {
        "_id": 4,
        "name": "$600 to $799",
        "array": [600, 799]
    },
    {
        "_id": 5,
        "name": "More than $800",
        "array": [800, 1500000]
    }
]

export {
    continents,
    price
}