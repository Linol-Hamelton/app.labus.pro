import nodeExternals from 'webpack-node-externals';

export const target = 'node';
export const externalsPresets = { node: true };
export const externals = [nodeExternals()];