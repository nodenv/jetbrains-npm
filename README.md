# jetbrains-npm shim

Fix IntelliJ/WebStorm's npm integration under nodenv

## Pre-requisites

This shim assumes you have already selected nodenv's shim as your node runtime within your IDE's preferences:

![image](https://user-images.githubusercontent.com/119972/50924357-5984e700-141d-11e9-90bc-8d63dcb26287.png)

## Installation

### nodenv plugin

```sh
git clone https://github.com/nodenv/jetbrains-npm "$(nodenv root)"/plugins/jetbrains-npm
```

After installation, set the [Package Manager path](#Package-Manager) to the output of:

```sh
echo "$(nodenv root)"/plugins/jetbrains-npm
```

### jetbrains-aware git clone

```sh
mkdir -p "$(nodenv root)/lib/node_modules"
git clone https://github.com/nodenv/jetbrains-npm "$(nodenv root)"/lib/node_modules/npm
```

After installation, the IDE should automatically find the shim and include it in the list of available [package managers](#Package-Manager); just select it!

### standalone clone

You may also choose to clone the shim to any location on disk that you like.

```sh
# in whatever directory you like:
git clone https://github.com/nodenv/jetbrains-npm
```

After installation:
1. set your [Package Manager path](#Package-Manager) as the path to your clone
2. ensure [`NODENV_ROOT`](#Nodenv-Root) is set in your IDE environment


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

## Configuration

### Package Manager

Regardless of your installation method, you will need to explicitly configure your package manager within IntelliJ/WebStorm.
It may be detected by the IDE automatically, in which case you merely need to select it.
Or you may need to paste in the full path manually.

The package manager setting is found under: `Languages & Frameworks -> Node.js and NPM -> Package manager`.
It should be set to the path where this shim was installed. (ie, the directory that _contains_ this shim's package.json file)

![50924463-9f41af80-141d-11e9-8322-0456278c9bfd](https://user-images.githubusercontent.com/119972/50924683-47577880-141e-11e9-9438-e01bac8ad118.png)

### Nodenv Root

If you use the default path of `~/.nodenv` as your nodenv root, you're all set;
the shim should be able to derive your nodenv root location automatically.

If you use a custom location for nodenv root, you must ensure `NODENV_ROOT` is set accordingly and exported in IntelliJ/WebStorm's environment in one of the following ways:
    - set and export it in `~/.profile` or `~/.bash_profile`
    - or source `~/.bashrc` from `~/.profile` or `~/.bash_profile`
    - or always launch IntelliJ/WebStorm from a terminal
    - or modify the IDE desktop launcher to launch bash interactively

(see https://youtrack.jetbrains.com/issue/IDEABKL-7589 for more details about JetBrains and environment variables)
