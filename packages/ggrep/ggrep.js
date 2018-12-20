#!/usr/bin/env node

const gitGrep = require("../git-grep/");
const program = require('commander');
const chalk = require('chalk');
const path = require('path');

var repository_path = function(directory) {
        // TODO: check it exists.
        // TODO: check is valid git repo
    if (!directory.endsWith(".git")) {
        return path.join(directory, ".git")
    }
    return directory;
}

var search = function(repository, keyword) {
    const repo = repository_path(repository);
    // TODO: rename keyword to term
    var first = true;
    var index = 0;
    gitGrep(repo, {
        rev: "HEAD",
        term: keyword
    }).on("data", function(data) {
        if (first) {
            console.log("%s\t%s\t\t%s\t\%s", chalk.yellow.underline("Index"), chalk.blue.underline("File"), chalk.green.underline("Line"), chalk.underline("Content"))
            first = false;
        }
        // TODO: use zebra coloring on index
        // TODO: should we highlight all occurences of the keyword?
        console.log('%s\t%s\t\t%s\t\t%s', chalk.yellow(index++), chalk.blue(data.file), chalk.green(data.line), data.text.replace(keyword, chalk.bold.red(keyword)));
    }).on("error", function(err) {
        throw err;
    }).on("end", function() {
        // The end.
    });
}

program.command('local')
    .option('-d, --directory <directory>', 'Use local git repository')
    .option('-k, --keyword <keyword>', 'Keyword to look for')
    .action((cmd) => {
        search(cmd["directory"], cmd["keyword"]);
    })

program.command('remote <repo>')
    .option('-r, --remote', 'Use remote git repository')
    .action(function(remote, cmd) {
        console.log('Remote=%s', remote);
        // TODO: Make sure valid protocol can be inferred.
    })

// Default behviour should be to search in the current directory
program.command('*').action((term) => {
    search('.', term)
});


program.parse(process.argv);