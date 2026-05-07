const fs = require('fs');
let code = fs.readFileSync('src/components/modules/HouseEstimator.tsx', 'utf-8');

code = code.split('                    <div className="border border-slate-200 rounded-2xl overflow-hidden bg-white shadow-sm mb-8">\n                      <table className="w-full text-sm text-left">').join('                    <div className="border border-slate-200 rounded-2xl overflow-hidden bg-white shadow-sm mb-8">\n                      <div className="overflow-x-auto">\n                      <table className="w-full text-sm text-left min-w-[700px]">');

code = code.split('                        </tbody>\n                      </table>\n                    </div>\n\n                    <div className="flex-1 min-h-[250px] w-full relative mt-4">').join('                        </tbody>\n                      </table>\n                      </div>\n                    </div>\n\n                    <div className="flex-1 min-h-[250px] w-full relative mt-4">');

fs.writeFileSync('src/components/modules/HouseEstimator.tsx', code);
