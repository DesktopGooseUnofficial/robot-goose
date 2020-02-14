/**
 * This is the main entrypoint to your Probot app
 * @param {import('probot').Application} app
 */
module.exports = app => {
  // Your code here
  app.log('Yay, the app was loaded! Honk honk.')

  app.on('pull_request.closed', async context => {
    if (context.payload.pull_request.merged) {
      app.log('Woohoo, a user\'s pull request was merged')
      const issueComment = context.issue({ body: 'Congrats on getting your pull request merged! We hope you will make more pull requests in the future.\nRemember to delete your branch!' })
      return context.github.issues.createComment(issueComment)
    }
  })

  app.on('pull_request.opened', async context => {
    app.log('I just found a new pull request')
    const issueComment = context.issue({ body: 'Quick reminder that we do no longer allow mods made on v0.21 and below. (getting this message does not mean your PR contains <v0.3 mods)' })
    return context.github.issues.createComment(issueComment)
  })

  app.on('issues.labeled', async context => {
    app.log("Issue labeled")
    for (const label of context.payload.issue.labels) {
      if (label.name === "destructive" || label.name === "malicious") {
        app.log("Oh no! Destructive mod request!")
        await context.github.issues.update(context.issue({
          state: 'closed'
        }))
        const issueComment = context.issue({ body: 'We do not allow mod requests that are considered destructive or malicious. Sorry!' })
        return context.github.issues.createComment(issueComment)
      }
    }
  })

  app.on('pull_request.labeled', async context => {
    app.log("Pull request labeled")
    for (const label of context.payload.pull_request.labels) {
      if (label.name === "destructive" || label.name === "malicious") {
        app.log("Oh no! Destructive mod pull request!")
        await context.github.issues.update(context.issue({
          state: 'closed'
        }))
        const issueComment = context.issue({ body: 'We do not allow mods that are considered destructive or malicious. Sorry!' })
        return context.github.issues.createComment(issueComment)
      } else if (label.name === "source code requested") {
          app.log("Oh no! Looks like some user forgot the source code...")
          const issueComment = context.issue({ body: 'For users security and for reviewing purposes, **publicly** available source code is required to publish your mod(s) to ResourceHub.\n\nPlease comment on this PR with a link to your mod source code (preferably hosted on GitHub) and also add the link to your mod\'s ResourceHub page.\n\nIf the mod is a super small mod which isn\'t complicated, you may want to add its source code to the mod\'s ResourceHub page instead.\n\nhttps://github.com/DesktopGooseUnofficial/ResourceHub/blob/master/CONTRIBUTING.md' })
          return context.github.issues.createComment(issueComment)
      } else if (label.name === "updated source code requested") {
        app.log("Oh no! Looks like some user forgot to update their source code...")
        const issueComment = context.issue({ body: 'It looks like you haven\'t updated your code on your link to the source code for the mod(s). Please update your code first.' })
        return context.github.issues.createComment(issueComment)
      }
    }
  })

  app.on('*', async context => {
    context.log({ event: context.event, action: context.payload.action })
  })

  // For more information on building apps:
  // https://probot.github.io/docs/

  // To get your app running against GitHub, see:
  // https://probot.github.io/docs/development/
}
