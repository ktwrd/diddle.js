<center>
  <h1>diddle.js</h1>
</center>

## Install Development Enviroment
Installs diddle.js development enviroment in current directory.

### Requirements
- Minimum Hardware
  - 2C/2T 64-bit Processor @ 2.0GHz
  - 8GB RAM
  - 60GB+ Disk Space
  - 512MB VRam
  - Linux Kernel 4.19.x
  - Windows 1903
- Recomemded Hardware
  - 4C/4T 64-bit Processor @ 3.8GHz
  - 16GB RAM
  - 60GB+ Disk Space
  - 3GB VRam
  - Linux Kernel 4.19.x or 5.13.x
  - Windows 20H2
- Software
  - Node v14.x
  - NPM  v6.x.x
  - curl v6.x.x or newer
  - git  v2.20.1 or newer
  - bash v4.x.x or newer
  - sudo v1.x.x or newer

### Install with cURL
```bash
$ bash <(curl -s https://diddle.js.org/setup-dev.sh)
```

### Install with wget
```bash
$ wget https://diddle.js.org/setup-dev.sh
$ chmod +x setup-dev.sh
$ ./setup-dev.sh
```

### Folder Structure
```
./ (directory where setup script was ran)
└── diddle.js
    ├── dev (branch 'dev')
    │   ├── engine
    │   ├── node_modules
    │   └── scripts
    ├── docs (branch 'docs')
    │   ├── docs
    │   ├── node_modules
    │   ├── source (submodule)
    │   └── source-dev (submodule)
    └── test (Script Testing Area)
        └── node_modules
```
