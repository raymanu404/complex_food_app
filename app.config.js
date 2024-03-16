module.exports = ({config}) => {
  return {
    name: config.name,
    ...config,
  };
};
