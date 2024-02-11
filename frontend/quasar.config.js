module.exports = function (/* ctx */) {
    return {
      framework: {
        // Quasar framework options
        components: [
          'QPageContainer',
          // Add other Quasar components you're using here
        ],
        directives: [],
        plugins: ['Notify'],
      },
    };
  };
  