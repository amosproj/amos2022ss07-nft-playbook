async function progress() {
  process.stdout.write('.');
  setTimeout(progress, 500);
}

progress();
