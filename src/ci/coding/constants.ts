const NPM_INSTALL_SHELL =
  "''cat > npm.sh << EOF\r\n#! /bin/bash\r\n" +
  'rootPath=\\\\`pwd\\\\`\r\n' +
  'function read_dir(){\r\n' +
  '  for file in \\\\`ls \\\\$1\\\\`\r\n' +
  '  do\r\n' +
  "    if [ -d \\\\$1'/'\\\\$file ]; then\r\n" +
  "      if [ \\\\$file != 'node_modules' ]; then\r\n" +
  "        read_dir \\\\$1'/'\\\\$file\r\n" +
  '      fi\r\n' +
  '    else\r\n' +
  "      if [ \\\\$file = 'package.json' ]; then\r\n" +
  '        cd \\\\$1\r\n' +
  '        npm install\r\n' +
  '        cd \\\\$rootPath\r\n' +
  '      fi\r\n' +
  '    fi\r\n' +
  '  done\r\n' +
  '}\r\n' +
  "read_dir \\\\$1\r\nEOF''";

export { NPM_INSTALL_SHELL };
