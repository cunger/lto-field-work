function Report() {
  return {
    local: {
      Catch: 0,
      Trash: 0,
    },
    uploaded: {
      Catch: {},
      Trash: {},
    },
    total: 0,
    countItem: function (item) {
      try {
        const count = item.quantity || 1;
        this.total += count;
        if (item.synced) {
          if (item.type == 'Catch' && item.species) {
            this.uploaded.Catch[item.species] = (this.uploaded.Catch[item.species] || 0) + count;
          }
          if (item.type == 'Trash') {
            let category = `${item.category}`;
            if (category.startsWith('Plastic')) category = 'Plastic piece';
            this.uploaded.Trash[category] = (this.uploaded.Trash[category] || 0) + count;
          }
        } else {
          this.local[item.type] += count;
        }
      } catch (e) {
        // TODO Monitoring!
        console.log(e);
      }
    },
  };
}

export default Report;
