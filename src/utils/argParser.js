// export const argParser = (str) => {
//     return str.split(' ');
// }

export const argParser = (args) => {
    const result = { };

    args.forEach((arg, index, array) => {
        if(arg && arg.startsWith('--') && array[index + 1]){
            result[arg.slice(2)] = array[index + 1];
        }

        if(arg && arg.startsWith('--save')){
            result['save'] = true;
        }
    });

    return result;
}