var cmd = "";
var hostname = "dongs";
var username = "dsiebels";
var users = {"dsiebels": "373733432d3eacd56028faaf8ff50b805588da99"};
var fs = {};
var dir = "/home/dsiebels/";
var commands = {"ls": lsCommand, "whoami":whoamiCommand, "cat":catCommand, "time":timeCommand};
var prgm = "bash";
var bashHistoryIndex = -1;
var bashHistory = [];
var colors = {"white": "\033[0;37m", "lightblue":"\033[0;34m"};
fs["/home/dsiebels/"] = "\x00;.;..;directory/;my_boy.txt;something.txt;will.txt;";
fs["/home/dsiebels/my_boy.txt"] = "my boy\n\rmy boy\n\rmy boy\n\rmy boy\n\rmy boy\n\rmy boy\n\rmy boy\n\rmy boy\n\rmy boy\n\rmy boy\n\rmy boy\n\rmy boy\n\rmy boy\n\rmy boy\n\r";
fs["/home/dsiebels/something.txt"] = "hi";
fs["/home/dsiebels/will.txt"] = "yams";

Terminal.cursorBlink = true;

var term = new Terminal({
  cols: 150,
  rows: 45,
  useStyle: true
});

window.onload = function() {
  
  term.open(document.body);

  writeUserInfo();

  term.on('data', function(data) {
    switch (data.charCodeAt(0)) {
      case 127:
        if (term.x > getUserInfoLength()) {
          term.write("\x08\x20\x08");
          cmd = cmd.slice(0, -1);
        }
        break;
      case 27:
        if (data == "\x1b[A") {
          if (bashHistoryIndex < bashHistory.length - 1) {
            bashHistoryIndex++;
            var furCoat = bashHistory[bashHistoryIndex];
            clearLine();
            writeUserInfo();
            term.write(furCoat);
            cmd = furCoat;
          }
        }
        else if (data == "\x1b[B") {
          if (bashHistoryIndex > -1) {
            bashHistoryIndex--;
            var bigTractor = bashHistory[bashHistoryIndex];
            if (bashHistoryIndex == -1) {
              bigTractor = "";
            }
            clearLine();
            writeUserInfo();
            term.write(bigTractor);
            cmd = bigTractor;
          }
        }
        else if (data == "\x1b[C") {
          if (term.x < (cmd.length + getUserInfoLength())) {
            term.write(data);
          }
        }
        else if (data == "\x1b[D") {
          if (term.x > getUserInfoLength()) {
            term.write(data);
          }
        }
        else {
          term.write(data);
        }
        break;
      case 13:
        term.write("\n\r");
        procCmd(cmd.split(" "));
        if (cmd != "")
          bashHistory.unshift(cmd);
        bashHistoryIndex = -1;
        cmd = "";
        break;
      default:
        term.write(data);
        cmd += data;
        break;
    }
  });

};

function clearLine() {
  term.write("\r");
  for (var leedle = 0; leedle < term.cols; leedle++)
    term.write("\x20");
  term.write("\r");
}

function writeUserInfo() {
  term.write("[" + username + "@" + hostname + ":" + (dir == "/home/" + username + "/" ? "~" : dir) + "]# ");
}

function getUserInfoLength() {
  return ("[" + username + "@" + hostname + ":" + (dir == "/home/" + username + "/" ? "~" : dir) + "]# ").length;
}

function sha1(var string) {
  return CryptoJS.SHA1(string).toString(CryptoJS.enc.Hex);
}

function compareHash(var h1, var h2) {
  if (h1 == h2)
    return true;
  else
    return false;
}

function procCmd(cmd) {
  console.log(cmd);
  if (commands[cmd[0]] == undefined) {
    term.writeln("bash: " + cmd[0] + ": command not found");
    writeUserInfo();
    return;
  }
  commands[cmd[0]](cmd);
  writeUserInfo();
}

function lsCommand(args) {
  args[0] = undefined;
  console.log("ls " + args);
  var imblyin = dir;
  fs[imblyin].split(";").forEach(function (name, index) {
    console.log(name);
    if (name.charAt(0) == "." || name.charAt(0) == "\x00") {
      return;
    }
    if (name.charAt(name.length - 1) == "/") {
      term.write(colors["lightblue"] + name.substring(0, name.length - 1) + "\t");
    }
    else {
      term.write(name + "\t");
    }
    term.write(colors["white"]);
  });
  term.writeln("");
}

function whoamiCommand(args) {
  term.writeln(username);
}

function catCommand(args) {
  var imblyin = dir;
  if (args[1] == undefined) {
    term.writeln("usage: cat file");
    return;
  }
  if (args[1].charAt(0) == "/") {
    imblyin = args[1];
  }
  else {
    imblyin += args[1];
  }
  console.log(imblyin);
  if (fs[imblyin] != undefined) {
    if (fs[imblyin].charAt(0) == "\x00") {
      term.writeln("cat: " + args[1] + ": file not found");
      return;
    }
    term.writeln(fs[imblyin]);
  }
  else {
    term.writeln("cat: " + args[1] + ": file not found");
  }
}

function timeCommand(args) {
  var dicks = new Date();
  term.writeln(dicks.getHours() + ":" + dicks.getMinutes() + ":" + dicks.getSeconds());
}