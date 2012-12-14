var config = module.exports;

config["My tests"] = {
    rootPath: "../",
    environment: "browser", // or "node"
    libs: [
        "js/knockout/*.js",
        "js/jQuery/js/*.js",
        "js/underscore/*.js"
    ],
    sources: [
        "js/todo.js"
    ],
    tests: [
        "test/**/*.test.js"
    ]
};
