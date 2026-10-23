# 🚀 Install the Cybercore Control Plane

## 🌐 Hosted installation

The Control Plane is already published as a static Pages application. Open
the [live Control Plane](https://cybercoretech.github.io/cybercore-control-plane/)
and bookmark it. This is the recommended path for browsing the 312-theme
registry, family Cybercards, palette contract, and runtime surfaces.

## 💻 Local installation

Clone the repository and serve its root directory with any static web server:

```sh
git clone https://github.com/cybercoretech/cybercore-control-plane.git
cd cybercore-control-plane
python3 -m http.server 8000
```

Then open `http://127.0.0.1:8000/`. No build step or Node installation is
required.

## 🧰 Optional Rust tooling

Cybercore 0.8 publishes `cybercore-theme`, a command-line tool for checking
theme quality, compatibility, and portable theme packs. Install Rust and Cargo
first, then run:

```sh
curl -fsSL https://cybercoretech.github.io/cybercore/install.sh | sh
```

The installer requires Cargo and installs only the `cybercore-theme` binary. It
does not install the Control Plane, Rust library, or Web Kit because those are
separate distribution surfaces.
For Rust applications, add `cybercore = "0.8"` to `Cargo.toml`. The equivalent
direct CLI installation command is:

```sh
cargo install --locked cybercore --bin cybercore-theme
```

The script source is [`install.sh`](install.sh).
