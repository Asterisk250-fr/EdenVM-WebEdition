// Configuration settings for VM

const vmSettings = {
    hardwareOptions: {
        cpu: "4 vCPUs",
        memory: "8GB RAM",
        diskSpace: "100GB",
    },
    preinstalledISOs: [
        "ubuntu-20.04-live-server-amd64.iso",
        "centos-7-x86_64-DVD-2009.iso",
        "debian-10.10.0-amd64-netinst.iso",
    ],
};

module.exports = vmSettings;