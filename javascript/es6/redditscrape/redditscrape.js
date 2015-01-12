'use strict';

(function() {

  const redditBaseUrl = 'https://www.reddit.com';

  function get(url) {
    return new Promise(function(resolve, reject) {
      var request = new XMLHttpRequest();
      request.open('get', url);
      request.onload = function() {
        if (this.status === 200) {
          resolve(this);
        } else {
          reject(`Error loading url ${url}: got status ${this.status}`);
        }
      };
      request.onerror = function() {
        reject(Error(`Error loading ${url}`));
      };

      request.send();
    });
  }

  function getJSON(url) {
    return get(url)
        .then(response => response.responseText)
        .then(JSON.parse);
  }

  function* commentsGen(postsWrapperNode, context) {
    for (let childNode of postsWrapperNode.data.children) {
      let data = childNode.data;
      if (data.body && data.author) {
        let commentChain = { data, context };
        yield commentChain;
        if (data.replies) {
          yield* commentsGen(data.replies, commentChain);
        }
      }
    }
  }

  function handleTopComment(topComment) {
    addCommentChainToDom(topComment);
  }

  function handleDone() {
    hideSpinner();
  }

  function addCommentChainToDom(commentChain) {
    class DivBuilder {
      constructor(...classNames) {
        this.classNames = classNames;
      }

      addClassNames(...classNames) {
        this.classNames.push(...classNames);
        return this;
      }

      withBody(body) {
        this.body = body;
        return this;
      }

      withAuthor(author) {
        this.author = author;
        return this;
      }

      withScore(score) {
        this.score = score;
        return this;
      }

      withContext(contextDiv) {
        this.contextDiv = contextDiv;
        return this;
      }

      build() {
        var div = document.createElement('div');
        div.className = this.classNames.join(' ');

        for (let prop of ['body', 'author', 'score']) {
          if (this[prop]) {
            let childNode = document.createElement('span');
            childNode.className = prop;

            let content = this[prop];
            // If link not set to null, it retains value from previous iteration
            // Is this part of the specification or a traceur bug?
            let link = null;
            if (typeof this[prop] === 'object') {
              // Note: cannot destructure without var/let keyword, i.e.
              // { content, link } = this[prop];  <-- invalid
              content = this[prop].content;
              link = this[prop].link;
            }

            let nestedNode = document.createElement('span');
            nestedNode.className = 'content';
            nestedNode.innerHTML = content;

            if (link) {
              let anchorNode = document.createElement('a');
              anchorNode.href = link;
              anchorNode.appendChild(nestedNode);

              nestedNode = anchorNode;
            }

            childNode.appendChild(nestedNode);

            div.appendChild(childNode);
          }
        }

        if (this.contextDiv) {
          div.appendChild(this.contextDiv);
        }

        return div;
      }
    }

    function createDiv(post, ...additionalClassNames) {
      var divBuilder = new DivBuilder();
      var data = post.data;

      if (post.hasOwnProperty('context')) {
        divBuilder = divBuilder
            .addClassNames('comment')
            .withBody(data.body)
            .withContext(createDiv(post.context, 'context'));
      } else {
        divBuilder = divBuilder
            .addClassNames('post')
            .withBody({
              content: data.title,
              link: `${redditBaseUrl}${data.permalink}`
            });
      }

      return divBuilder
        .addClassNames(...additionalClassNames)
        .withAuthor(data.author)
        .withScore(data.score)
        .build();
    }

    document.getElementById('comments').appendChild(createDiv(commentChain));
  }

  function hideSpinner() {
    document.getElementById('spinner').style.display = 'none';
  }

  var json = getJSON(`${redditBaseUrl}/r/funny.json`);
  json.then(
    function(json) {
      return json.data.children
          .filter(post => !post.data.over_18)
          .sort((p1, p2) => p2.data.score - p1.data.score)
          .map(post => `${redditBaseUrl}${post.data.permalink}.json`)
          .map(getJSON)  // async
          .reduce(
            function(promiseChain, promise) {
              return promiseChain
                  .then(() => promise)  // wait for resolution
                  .then(
                    function(postJsonRoot) {
                      var originalPostData = postJsonRoot[0].data.children[0].data;
                      var comments = Array.from(commentsGen(postJsonRoot[1], { data: originalPostData }));

                      if (comments.length > 0) {
                        let topComment = comments.sort((c1, c2) => c2.data.score - c1.data.score)[0];
                        handleTopComment(topComment);
                      }
                    },
                    function(error) {
                      console.error(error);
                    }
                  );
            }, Promise.resolve()
          );
    },
    function(error) {
      console.error(error);
    }
  ).then(handleDone);

})();
