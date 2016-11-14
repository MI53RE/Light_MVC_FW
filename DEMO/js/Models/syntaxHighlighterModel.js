app.models.SyntaxHighlighterModel = (function() {
    var Observable = app.libs.Observable;

    function SyntaxHighlighterModel(name) {
        Observable.call(this);
        // here goes attributes;
        this.name = name;
        this.hasChild = false;
        this.isParameters = false;
        this.isComment = false;
        this.isUnicode = false;
        this.type = ['var', 'class', 'function', 'window', 'document'];
        this.keyWord = ['if', 'else', 'typeof', 'switch', 'for', 'in', 'while', 'break', 'return', 'new'];
        this.specChar = [
            {value:'<', unicode:'lt'},
            {value:'>', unicode:'gt'},
            {value:'&', unicode:'amp'},
            {value:'-', unicode:'-'},
            {value:'/', unicode:'/'},
            {value:'+', unicode:'+'},
            {value:'*', unicode:'*'},
            {value:'|', unicode:'|'},
            {value:'!', unicode:'!'},
            {value:'?', unicode:'?'},
            {value:'$', unicode:'$'},
            {value:'^', unicode:'^'},
            {value:'=', unicode:'='}
        ];
        this.patternList = {
            'tag': /(<)(\/*)([a-z]*\s*?)([^]*?)(>)/gi,
            'htmlAttributes': /([^]*?)=("[^]*?"\s?)/gi,
            'escape': /\\[^]/gi,
            'lineEnding': /\n|\r\n|\r/g,
            'string': /(\'[^]*\')|(\"[^]*\")/g,
            'number': /^(\-|\+)?(\d+(?:\.\d+)?|Infinity)$/,
            'parameters': /(?:function\s*\()(\w*,?\s?)+(?:\)?)/gi,
            'function': /(?:(?:\w*\.)*)(\w*)\s?=|function\s\w*\s*\(/g,
            'functionCall': /((?:\w*\.)*)(?!function)(\w*)\(/g,
            'class': /(^[A-Z]+\w*)/g,
            'parent': /(^[A-Z]+\w*)/g,
        }
        this.classPatternList = {
            'tag': 'pre-tag',
            'htmlAttributes': 'pre-attr',
            'escape': 'pre-const',
            'lineEnding': 'pre-const',
            'string': 'pre-string',
            'number': 'pre-num',
            'parameters': 'pre-params',
            'function': 'pre-funct',
            'functionCall': 'pre-call',
            'class': 'pre-class',
            'parent': 'pre-parent',
        }
    }
    SyntaxHighlighterModel.prototype = Object.create(Observable.prototype);
    SyntaxHighlighterModel.prototype.constructor = SyntaxHighlighterModel;
    
    SyntaxHighlighterModel.prototype.setHtmlHighlighter = function(match, p1, p2, p3, p4, p5, offset, string) {
        p1 = "&lt;"
        p3 = '<span class="pre-tag">' + p3 + '</span>';
        p5 = "&gt;"
        var tmp = p4.match(/([^]*?)=("[^]*?"\s?)/g);
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
      //    console.log('p1:"' + p1 + '"', /*'p2:"' + p2 + '"',*/ 'p3:"' + p3 + '"'/*, 'p4:"' + p4 + '"', 'p5:"' + p5 + '"', 'p6:"' + p6 + '"'*/, this.hasChild);
        if (/\\./.test(p1)) {
            p1 = '<span class="pre-const">' + p1 + '</span>';
        } else if (p1.charAt(0) === '\'' || p1.charAt(0) === '\"') {
            p1 = '<span class="pre-string">' + p1 + '</span>';
        } else if (p1 === 'function' && p3 === '(') {
            p1 = '<span class="pre-type">' + p1 + '</span>';
            this.isParameters = true;
        } else if (this.type.indexOf(p1) !== -1) {
            p1 = '<span class="pre-type">' + p1 + '</span>';
        } else if (this.isParameters === true && p3 === ')') {
            p1 = '<span class="pre-ctx">' + p1 + '</span>';
            this.isParameters = false;
        } else if(p1 === 'this' || p1 === 'self') {
            p1 = '<span class="pre-ctx">' + p1 + '</span>';
        } else if (this.patternList.number.test(p1)) {
            p1 = '<span class="pre-num">' + p1 + '</span>';
        } else if (p1 !== '' && this.hasChild === true && p3 === '=') {
            p1 = '<span class="pre-funct">' + p1 + '</span>';
            this.hasChild = false;
        } else if (p1 !== '' && this.isParameters === true) {
            p1 = '<span class="pre-ctx">' + p1 + '</span>';
        } else if (this.keyWord.indexOf(p1) !== -1) {
            p1 = '<span class="pre-key-word">' + p1 + '</span>';
        } else if (p1 && p3 === '.') {
            p1 = '<span class="' + ( /[A-Z]/.test(p1.charAt(0)) ? 'pre-class' : 'pre-parent') + '">' + p1 + '</span>';
            this.hasChild = true;
        } else {
            if (/[A-Z]/.test(p1.charAt(0))) {
                p1 = '<span class="pre-class">' + p1 + '</span>';
            }
            this.hasChild = false;
        } 
        if (p1 === '-') {
            p1 = '<span class="pre-key-word">' + p1 + '</span>';
        }
        if (p3 === '&' && this.isUnicode === false) {
            this.isUnicode = true;
            // console.log('SCORE: ' + p3)
            p3 = '';
        } else if (this.isUnicode === true && this.findCharInUnicode(p1) !== -1) {
            var value = this.findCharInUnicode(p1);
            p1 = '';
            p3 = '<span class="pre-key-word">' + value + '</span>';
            this.isUnicode = false;
        } else if (this.isUnicode === false && this.findCharInValue(p3) !== -1) {
            p3 = '<span class="pre-key-word">' + p3 + '</span>';
        }
        return [p1,p2,p3].join('');
    }

    SyntaxHighlighterModel.prototype.findCharInUnicode = function(value) {
        var length = this.specChar.length;
        // console.log('val:',value);
        for (var i = 0; i < length; i++) {
            if (this.specChar[i].unicode === value) {
                return this.specChar[i].value;
            }
        }
        return -1;
    }

    SyntaxHighlighterModel.prototype.findCharInValue = function(value) {
        var length = this.specChar.length;
        for (var i = 0; i < length; i++) {
            if (this.specChar[i].value === value) {
                return this.specChar[i].value;
            }
        }
        return -1;
    }

    SyntaxHighlighterModel.prototype.setJavascriptLines = function(match, p1, offset, string) {
        var self = this;
        var matches = {};
           // console.log('p1:"' + p1 + '"');
           if (/.*\s*\/\*\s*.*/.test(p1)) {
            p1 = '<span class="pre-comment">' + p1 /*+ '</span>'*/;
                self.isComment = true;
           } 
           if (self.isComment === true && /\s*.*\*\/\s*.*/.test(p1)) {
                p1.replace(/(\s*.*\*\/)(\s*.*)/, function(match, p1a, p2a, offset, string) {
                    // console.log('p1a:"' + p1a + '"', 'p2a:"' + p2a + '"');
                    var finalString = [
                       /* '<span class="pre-comment">' +*/ p1a + '</span>',
                        p2a.replace(/((?:\"(?:\w*\-?)+\")|(?:'?(?:\w*\-?)+'?)|(?:\\\w|\\\W))(\s*)([\!\-\+\=\.\(\)\{\}\[\\\]\,\;\&\<\>\^\|\$\:\*\/])?/gi, self.setJavascriptHighlighter.bind(self)),
                        '\n'
                        ]
                    p1 = finalString.join('');
                })
                self.isComment = false;
           } else if (/\s*(?:\/\/|\/\*)\s*.*/.test(p1) || self.isComment === true) {
            p1 = '<span class="pre-comment">' + p1 + '</span>';
           } else if (!(/\s*(?:\/\/|\/\*)\s*.*/.test(p1)) && self.isComment === false) {
                p1 = p1.replace(/((?:(?:\\.)|\"(?:\w*\-?)+\")|(?:\\?'?(?:\w*\-?)+'?)|(?:\\\w|\\\W))(\s*)([\!\-\+\=\.\(\)\{\}\[\]\,\;\&\<\>\^\|\$\:\*\/])?/gi, self.setJavascriptHighlighter.bind(self));
           }
            // for (pattern in this.patternList) {
            //     // matches[pattern] = this.patternList[pattern].exec(match);
            //     matches[pattern] = this.patternList[pattern].exec(p1+p2+p3);
            //     if (matches[pattern] !== null) {
            //         for (var i = 0; i < matches[pattern].length; i++) {
            //             p2 = '<span class="' + this.classPatternList[pattern] + '">' + p2 + '</span>';
            //         }
            //     }
            // } 
           // console.log(matches);
         return p1;
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
            var result = document.getElementById(devJavascript[i].dataset.targetId).innerHTML.replace(/(.*(?:\n|\r|\r\n))/gi, this.setJavascriptLines.bind(this)); 
            // var result = document.getElementById(devJavascript[i].dataset.targetId).innerHTML.replace(/((?:\"(?:\w*\-?)+\")|(?:'?(?:\w*\-?)+'?)|(?:\\\w|\\\W))(\s*)([\!\-\+\=\.\(\)\{\}\[\\\]\,\;\&\<\>\^\|\$\:\*\/])?/gi, this.setJavascriptHighlighter.bind(this));
            devJavascript[i].innerHTML = result;
        }
    }

    return SyntaxHighlighterModel;
}).call(this);

