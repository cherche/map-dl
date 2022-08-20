const formula1 = {
  name: 'Brampton Transit',
  shortName: 'BT',
  // site is just an extra place to find information on source. Not mandatory.
  site: 'https://www.brampton.ca/en/residents/transit/Pages/home.aspx',
  // The following info is type-dependent
  type: 'webscrape',
  url: 'https://www.brampton.ca/EN/residents/transit/plan-your-trip/Pages/Schedules-Maps-Covid.aspx',
  processes: [
    {
      // 'default' is just a convention. id is mandated for each process
      id: 'default',
      downloadExtension: 'pdf',
      omitOutputId: true, // default: false. Can only be set to true in one process
      manipulatePage(_) {
        // Takes a puppeteer Page instance as input. Allows extra
        // manipulation of scraper in case more interaction is needed
      },
      // The downloading and output generation are handled outside
      // This allows
      // - customization of download and output names
      // - customization of download and output destinations
      // - usage of a 'cache' to save processing time
      getDownloadUrl() {
        const buttons = document.querySelectorAll('.jumbotron.transit .btn')
        return buttons[1].href
      },
      // Output extension is segregated from output only because
      // pdftoppm requires it. But the design can be improved
      generateOutput(input, output) {
        const outputParts = output.split('.')
        const outputName = outputParts.slice(0, -1).join('.')
        const outputExtension= outputParts[outputParts.length - 1]
        filters.pdftoppm({
          input,
          outputName,
          outputExtension,
          page: 1,
          resolution: 10
        })
      }
    }
  ]
}

const formula2 = {
  name: 'UToronto Campus',
  shortName: 'UTCampus',
  type: 'static',
  downloadUrl: 'https://www.utoronto.ca/__shared/assets/3D_Map1103.pdf'
}
