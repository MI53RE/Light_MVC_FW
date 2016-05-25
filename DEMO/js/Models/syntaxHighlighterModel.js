app.models.SyntaxHighlighterModel = (function() {
    var Observable = app.libs.Observable;

    function SyntaxHighlighterModel(name) {
        Observable.call(this);
        // here goes attributes;
        this.name = name;
        this.hasChild = false;
        this.type = ['var', 'class', 'function', 'window', 'document', ];
        this.keyWord = ['if', 'else', 'typeof', 'switch', 'for', 'in', 'while', 'break', 'return'];
        this.specChar = ['+', '-', '/', '*', '<', '>', '|', '!', '?', '$', '^', '&', ];

    }
    SyntaxHighlighterModel.prototype = Object.create(Observable.prototype);
    SyntaxHighlighterModel.prototype.constructor = SyntaxHighlighterModel;
    
    SyntaxHighlighterModel.prototype.setHtmlHighlighter = function(match, p1, p2, p3, p4, p5, offset, string) {
        p1 = "&lt;"
        p3 = '<span class="pre-tag">' + p3 + '</span>';
        p5 = "&gt;"
        var tmp = p4.match(/([^]*?)(=)("[^]*?"\s*)/g);
        if (tmp !== null) {
            var attr = '';
            for (var i = 0; i < tmp.length; i++) {
                var splitted = tmp[i].split('=');
                attr += '<span class="pre-attr">' + splitted[0] + '</span>=<span class="pre-string">' + splitted[1] + '</span>'; 
            }
        }
        return [p1, p2, p3, attr, p5].join('');
    }

    SyntaxHighlighterModel.prototype.setJavascriptHighlighter = function(match, p1, p2, p3, p4, p5, p6, offset, string) {
        var code = '';
            console.log('"' + p1 + '"', '"' + p2 + '"', '"' + p3 + '"', '"' + p4 + '"', '"' + p5 + '"', this.hasChild);
        if (p1.charAt(0) === '\'' || p1.charAt(0) === '\"') {
            p1 = '<span class="pre-string">' + p1 + '</span>';
        } else if(p1 === 'this' || p1 === 'self') {
            p1 = '<span class="pre-ctx">' + p1 + '</span>';
        } else if (this.type.indexOf(p1) !== -1) {
            p1 = '<span class="pre-type">' + p1 + '</span>';
        } else if (this.keyWord.indexOf(p1) !== -1) {
            p1 = '<span class="pre-key-word">' + p1 + '</span>';
        } else if (p1 && p5 === '.') {
            p1 = '<span class="pre-class">' + p1 + '</span>';
            this.hasChild = true;
        } else if (p1 !== '' && this.hasChild === true && p5 === ' ') {
            p1 = '<span class="pre-funct">' + p1 + '</span>';
            this.hasChild = false;
        } else if (/^(\-|\+)?([0-9]+|Infinity)$/.test(p1)) {
            p1 = '<span class="pre-num">' + p1 + '</span>';
        } else {
            this.hasChild = false;
        }
        return [p1, p5].join('');
    }

    SyntaxHighlighterModel.prototype.setHtmlExamples = function() {
        var devHtml = document.getElementsByClassName("language-html");
        var devHtmlL = devHtml.length;
        for (var i = 0; i < devHtmlL; i++) {
            var result = document.getElementById(devHtml[i].dataset.targetId).innerHTML.replace(/(<)(\/*)([a-z]*\s*?)([^]*?)(>)/gi, this.setHtmlHighlighter);
            devHtml[i].innerHTML = result;
        }
    }

    SyntaxHighlighterModel.prototype.setJavascriptExamples = function() {
        this.hasChild = false;
        var devJavascript = document.getElementsByClassName("language-javascript");
        var devJavascriptL = devJavascript.length;
        for (var i = 0; i < devJavascriptL; i++) {
            var result = document.getElementById(devJavascript[i].dataset.targetId).innerHTML.replace(/(\[?(\'|\")?(\w*\-?)+(\'|\")?\]?)(\W?)/gi, this.setJavascriptHighlighter.bind(this));
            devJavascript[i].innerHTML = result;
        }
    }

    return SyntaxHighlighterModel;
}).call(this);

