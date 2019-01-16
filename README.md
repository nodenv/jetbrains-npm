# jetbrains-npm proxy

Fix IntelliJ/WebStorm's npm integration under nodenv

<!-- toc -->

- [Pre-requisites](#pre-requisites)
- [Installation](#installation)
  * [nodenv plugin](#nodenv-plugin)
  * [jetbrains-aware git clone](#jetbrains-aware-git-clone)
  * [standalone clone](#standalone-clone)
  * [homebrew](#homebrew)
  * [global npm or yarn package](#global-npm-or-yarn-package)
- [Configuration](#configuration)
  * [Package Manager](#package-manager)
  * [Nodenv Root](#nodenv-root)
- [Why is this necessary?](#why-is-this-necessary)
- [How it works](#how-it-works)

<!-- tocstop -->

## Pre-requisites

This proxy assumes you have already selected nodenv's shim as your node runtime within your IDE's preferences:

![image](https://user-images.githubusercontent.com/119972/50924357-5984e700-141d-11e9-90bc-8d63dcb26287.png)

## Installation

### nodenv plugin
__(recommended if you have a custom nodenv root)__

This installation method allows the proxy to find nodenv root automatically;
the tradeoff being that IntelliJ/WebStorm must be explicitly configured with the proxy's location.

```sh
git clone https://github.com/nodenv/jetbrains-npm "$(nodenv root)"/plugins/jetbrains-npm
```

After installation, set the [Package Manager path](#Package-Manager) to the output of:

```sh
echo "$(nodenv root)"/plugins/jetbrains-npm
```

### jetbrains-aware git clone
__(recommended if your nodenv root is the default ~/.nodenv)__

This installation method enables JetBrains to find the npm proxy automatically, as it is relative to the node executable: `../lib/node_modules/npm/bin/npm-cli.js`; (relative to `shims/node`)
the tradeoff requires ensuring the proxy can find your nodenv-root.

```sh
mkdir -p "$(nodenv root)/lib/node_modules"
git clone https://github.com/nodenv/jetbrains-npm "$(nodenv root)"/lib/node_modules/npm
```

After installation, the IDE should automatically find the proxy and include it in the list of available [package managers](#Package-Manager); just select it! (In fact, if the package manager field is empty before cloning, then a restart of WebStorm should select it automatically.)

### standalone clone

You may also choose to clone the proxy to any location on disk that you like.

```sh
# in whatever directory you like:
git clone https://github.com/nodenv/jetbrains-npm
```

After installation:
1. set your [Package Manager path](#Package-Manager) as the path to your clone
2. ensure [`NODENV_ROOT`](#Nodenv-Root) is set in your IDE environment


### homebrew

```sh
brew tap nodenv/nodenv
brew install jetbrains-npm
```

After installation, set the [Package Manager path](#Package-Manager) to the output of:

```sh
brew --prefix jetbrains-npm
```

And finally, ensure [`NODENV_ROOT`](#Nodenv-Root) is set in your IDE environment.

### global npm or yarn package

```sh
npm -g install @nodenv/jetbrains-npm
```

or

```sh
yarn global add @nodenv/jetbrains-npm
```

After installation, set the [Package Manager path](#Package-Manager) to the output of:

```sh
echo $(npm -g prefix)/lib/node_modules/@nodenv/jetbrains-npm
```

or

```sh
echo $(yarn global dir)/node_modules/@nodenv/jetbrains-npm
```

And finally, ensure [`NODENV_ROOT`](#Nodenv-Root) is set in your IDE environment.

*__NOTE:__*
Be aware which node is active when you install this package.
Remember that global npm installs are still contained within the node version itself. (`$(nodenv prefix)/lib/node_modules/`)
This means the package will be removed if you `nodenv uninstall` the particular node version.
Therefore, it's recommended to install this package globally using a _system_ node, such that this package will live outside nodenv versions.
Yarn, in contrast, defaults to installing global packages to a single shared global directory; outside the node version.

## Configuration

### Package Manager

Regardless of your installation method, you will need to explicitly configure your package manager within IntelliJ/WebStorm.
It may be detected by the IDE automatically, in which case you merely need to select it.
Or you may need to paste in the full path manually.

The package manager setting is found under: `Languages & Frameworks -> Node.js and NPM -> Package manager`.
It should be set to the path where this proxy was installed. (ie, the directory that _contains_ this proxy's package.json file)

![50924463-9f41af80-141d-11e9-8322-0456278c9bfd](https://user-images.githubusercontent.com/119972/50924683-47577880-141e-11e9-9438-e01bac8ad118.png)

### Nodenv Root

If you use the default path of `~/.nodenv` as your nodenv root, you're all set;
the proxy should be able to derive your nodenv root location automatically.

If you use a custom location for nodenv root, you must ensure `NODENV_ROOT` is set accordingly and exported in IntelliJ/WebStorm's environment in one of the following ways:
    - set and export it in `~/.profile` or `~/.bash_profile`
    - or source `~/.bashrc` from `~/.profile` or `~/.bash_profile`
    - or always launch IntelliJ/WebStorm from a terminal
    - or modify the IDE desktop launcher to launch bash interactively

(see https://youtrack.jetbrains.com/issue/IDEABKL-7589 for more details about JetBrains and environment variables)

## Why is this necessary?

IntelliJ/WebStorm, for its own reasons, does not directly execute the npm or yarn executable found in `PATH`.
Instead, it attempts to find the npm/yarn _package directory_, and invoke node with the `bin/npm-cli.js` or `bin/yarn.js` script.
([resolution logic](https://github.com/nodenv/nodenv/pull/129#discussion_r246391978))
Of course, nodenv only resolves the true location of the node (or npm/yarn) executable at invocation time.
This means JetBrains will never find the npm-cli.js or yarn.js scripts, since they do not exist relative to nodenv's node shim. (nor can they be found relative to nodenv's npm/yarn shims)

## How it works

This proxy conforms to the directory structure that JetBrains is hardcoded to find: the npm shim is at `bin/npm-cli.js`.
Thus, IntelliJ/WebStorm can be configured to treat this proxy as the "package manager".
The various installation options either support JetBrains' own lookup mechanisms such that JetBrains can find the proxy automatically, or allow the proxy to find nodenv-root automatically.

When the proxy is invoked, it derives the nodenv-root (either by the proxy's own file location, or by the `nodenv root` command which relies on `NODENV_ROOT` and defaults to `~/.nodenv`).
Then it proxies the invocation to nodenv's shim (found at `$(nodenv root)/shims/npm`); wherein nodenv can ensure the correct version of node+npm is activated according to `.node-version`, etc.
