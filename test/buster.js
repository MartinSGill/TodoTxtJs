var config = module.exports;

config["My tests"] = {
    rootPath: "../",
    environment: "browser", // or "node"
    libs: [
        "src/js/knockout/*.js",
        "src/js/jQuery/js/jquery.js",
        "src/js/jQuery/js/jquery-ui.js",
        "src/js/underscore/*.js"
    ],
    sources: [
        "src/js/todo.js"
    ],
    tests: [
        "test/**/*.test.js"
    ]
};
