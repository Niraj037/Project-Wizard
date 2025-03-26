#!/usr/bin/env node

import inquirer from "inquirer";
import chalk from "chalk";
import gradient from "gradient-string";
import figlet from "figlet";
import fs from "fs-extra";
import { execSync } from "child_process";
import cliProgress from "cli-progress";
console.clear();
console.log(
  gradient.pastel(figlet.textSync("Project Wizard !", { horizontalLayout: "full" }))
);
console.log(chalk.bold.cyan("\n✨ The Ultimate Project Setup CLI ✨\n"));
const progressBar = new cliProgress.SingleBar(
  {
    format: `⏳ {bar} {percentage}% | {task}`,
    barCompleteChar: "█",
    barIncompleteChar: "-",
    hideCursor: true,
  },
  cliProgress.Presets.shades_classic
);
const sleep = (ms) => new Promise((resolve) => setTimeout(resolve, ms));

const setupProject = async () => {
  const answers = await inquirer.prompt([
    { type: "input", name: "projectName", message: "🚀 Enter project name:", default: "my-app" },
    { type: "list", name: "framework", message: "📦 Select a framework:", choices: ["React", "Vue", "Next.js", "Express"] },
    { type: "confirm", name: "useTypescript", message: "🟦 Use TypeScript?", default: true },
    { type: "confirm", name: "useTailwind", message: "🎨 Include TailwindCSS?", default: true },
    { type: "confirm", name: "useEslint", message: "📏 Setup ESLint & Prettier?", default: true },
    { type: "confirm", name: "initializeGit", message: "🔧 Initialize Git repository?", default: true },
  ]);

  createProject(answers);
};

const createProject = async (config) => {
  console.log(chalk.green(`\n📁 Creating project: ${config.projectName}...\n`));

  fs.ensureDirSync(config.projectName);
  process.chdir(config.projectName);

  progressBar.start(100, 0, { task: "Initializing..." });
  await sleep(500);

  let frameworkCommand = "";
  switch (config.framework) {
    case "React":
      frameworkCommand = `npx create-react-app@latest . ${config.useTypescript ? "--template typescript" : ""}`;
      break;
    case "Vue":
      frameworkCommand = `npm create vite@latest . -- --template ${config.useTypescript ? "vue-ts" : "vue"}`;
      break;
    case "Next.js":
      frameworkCommand = `npx create-next-app@latest . ${config.useTypescript ? "--ts" : ""}`;
      break;
    case "Express":
      execSync("npm init -y", { stdio: "inherit" });
      execSync("npm install express", { stdio: "inherit" });
      fs.writeFileSync(
        "index.js",
        `import express from 'express';\nconst app = express();\nconst PORT = 3000;\napp.get('/', (req, res) => res.send('Hello World!'));\napp.listen(PORT, () => console.log(\`Server running on port \${PORT}\`));\n`
      );
      break;
  }

  if (frameworkCommand) {
    progressBar.update(25, { task: "Installing framework..." });
    execSync(frameworkCommand, { stdio: "inherit" });
  }

  if (config.useTailwind) {
    progressBar.update(50, { task: "Installing TailwindCSS..." });
    execSync("npx tailwindcss init -p", { stdio: "inherit" });
  }

  if (config.useEslint) {
    progressBar.update(75, { task: "Setting up ESLint & Prettier..." });
    execSync("npm install -D eslint prettier eslint-config-prettier eslint-plugin-prettier", { stdio: "inherit" });
    fs.writeFileSync(".eslintrc.json", JSON.stringify({ extends: ["prettier"] }, null, 2));
  }

  if (config.initializeGit) {
    progressBar.update(90, { task: "Initializing Git..." });
    execSync("git init", { stdio: "inherit" });
  }

  progressBar.update(100, { task: "Complete!" });
  progressBar.stop();

  console.log(gradient.pastel("\n🎉 Project setup complete! Happy coding! 🚀\n"));
  console.log(chalk.cyanBright("✨ Created by Niraj Bhakta ✨"));
  console.log(chalk.magentaBright("💙 Thank you for using Project Wizard ! 💙\n"));
};

setupProject();
