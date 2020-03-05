module.exports = {
    "moduleFileExtensions": [
        "js",
        "jsx",
        "json"
    ],
    "moduleDirectories": [
        "node_modules",
        "src"
    ],
    "moduleNameMapper": {
        "^.+\\.(css|scss)$": "<rootDir>/test/mocks/styleMock.js",
        "^.+\\.(jpg|jpeg|gif|png|svg|eot|ttf|woff|woff2|)$": "<rootDir>/test/mocks/imageMock.js"
    }
};
