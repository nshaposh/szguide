var guide_content = [
    {
	title:"Introduction",
	num:"0",
	prev:"contents",
	next:"1",
	content:[{
	    subtitle:"General",
	    name:"general",
	    text:["The Suzaku SNR Catalog is intented to provide a comprehesive account of all Suzaku observations of \
	    supernova remnants (SNRs).\
	     The analysis product includes images, spectra and spectral analysis. In most cases spectra are\
	     modeled as a sum of power law and a set gaussians. The results of spectral modeling are provided as table of individual spectral lines.",
	     "Currently catalog contains analysis of 464 Suzaku observations of 105 sources. Each observation has one or analysis results, performed \
	     for a particular set of regions, ARF generator settings, etc. An individual page is provided for each analysis,\
	     which features various plots of images and spectra. In the next setion we discuss the Suzaku data analysis procedure for the catalog \
	     in more detail."],
	}]
    },
    {
	title:"Data Reduction",
	num:"1",
	next:"contents",
	content:[
	{
	    subtitle:"Analysis Scripts",
	    text:[
	    "To perform analysis and create data products for the SNR catalog we developed a set of analysis tools. To use these scripts, three \
	    areas on a computed disk needs to provided. Specifically, directory for archival data, directory for processed data and directory for\
	    the final product. It is strongly recommended that all three areas occupy three different directories. PERL programs listed below\
	    take these directories as following parameters:",
	    "<ul><li>dataroot - the directory where scripts place or look for the Suzaku archival data.",
	    "<li>procroot - directory where scripts place or look for the processed data.",
	    "<li>analysisroot - derectory containing a final product for an observation.",
	    "</ul>",
	    "The archival data for analysis will be downloaded to the dataroot\/obsid directory, then processed (created by <i>aepipeline</i>) data\
	    will be placed into procroot/obsid directory and the final products, i.e. spectra, responses and images, are placed to analysisroot/obsid\
	    directory.",
	    "The following PERL scripts are used for analysis for the Suzaku SNR catalog:",
	    "<ul>",
	    "<li> <i>aegetobs</i> downloads sequence data from the HEASARC and performs data processing. It takes the sequence ID as parameter, downloads \
	    the data from the HEASARC and runs <i>aepipeline</i> to produce the processed data and places it to the procroot/obsid directory. ",
	    "<li> <i>aexispipe</i>  is the main PERL script.",
	    "It takes the following parameters",
	    "<ul><li>obsid - an observation sequence number",
	    "<li>xis - a set of comma separated numbers indicating the XISs, for which products will be created (defaul value -\"0,1,2,3\").",
	    "<li>reg - a region pattern indicator. Default value is \"std\" for which creates a set of standard regions for analysis. Other options include:\
	    pie,annuli,snr,",
	    "<li>analysis_name - sets the directory name for this particular analysis products will be placed under obsid directory.",
	    "<li>arf - defines which source type will be modeled by <i>xissimarfgen</i>. Namely, \"U\" for uniform extended source, \
	    \"P\" for a point source, and \"I\" for an IMAGE regime (see below for details).\
	     Default value is \"I\".",
	     "<li> R<sub>in</sub>, R<sub>out</sub> the radii in arcseconds which control the regions sizes (see below for details). Default values are 100 and 260 \
	     arcseconds correspondingly.",
	     "<li> centerx, centery - Sky coordinates (J2000,fk5) of the point at which the region pattern will be centered. If not specified, the image center \
	     coordinates are used. It also supplied as RA,DEC coordinates for <i>xissimarfgen</i> in the POINT mode.",
	    "</ul>",
	    "<li> <i>mkxisevt</i> creates filtered event files. It is intended to be called from <i>aexispipe</i>, but can be used separatelly as well.",
	    ]
	},
	{
	    subtitle:"Sky Regions Generation",
	    name:"reduction",
	    text:[
	      " A particular region pattern configuration is created according to region analysis settings.\
	       All regions are created in sky coordinates. Up to nine regions may be generated for a particular \
	       analysis run (this limit is set by maximum number of regions which can processed by XIS ancillary \
	       response generation utility xissimarfgen). Analysis script automatically detects XIS window mode and \
	       adjusts the regions if only a part of XIS was utilized during an observation.\
	       There are a number of patterns which can be utilized in the analysis. \
	       We also have developed a automated source search routine which queries the SIMBAD \
	       astronomical database and creates a set of regions for the X-ray sources found in the XIS field of view.\
	       Below we give some more details on the each strategy for source region generation.",
	       "<ul>",
	       "<li> <span style=\"text-decoration:underline;\">Standard regions:</span><br><br>\
		A standard region setting includes the entire CCD chip (excluding two corner CCD regions which have calibration source events), \
		two circular regions that are centered on the CCD chip center (by default, or the center of region pattern may be set by script parameters), \
		and two \"background\" regions covering areas near CCD edges.\
		 The standard regions setting are relevant mostly to AGN and XRBs sources, which area not affected by pile-up effect. \
		",
	       "<li> <span style=\"text-decoration:underline;\">Pie:</span><br><br>\
		A central region accompanied by eight azimuthal sections is created.\
		Radii of inner and outer circles are set by the analysis script.\
		",
	       "<li> <span style=\"text-decoration:underline;\">Pile-up</span><br><br>\
		This region pattern is most relevant for bright point sources, such as  X-ray binaries.\
		This pattern creates a set of circular region  with a central core of different size excluded. \
		",
	       "<li> <span style=\"text-decoration:underline;\">Annuli</span><br><br>\
		A set of nine concentric annulus regions with radii beginnig from R<sub>in</sub> to R<sub>out</sub>. \
		",
	       "<li> <span style=\"text-decoration:underline;\">SIMBAD sources</span><br><br>\
		For this option we identify a set of X-ray sources which may be present in the XIS chip field of view by querying the SIMBAD\
		 database located at http://simbad.u-strasbg.fr/simbad/. The database allows selecting on particular types of sources in a \
		 predefined sky region. We execute a set of queries to identify following sources in field: SNRs, ANGs, Pulsars, Galaxy clusters, \
		 X-ray binaries, Quasars, Blazars and Cataclysmic Variables. We assign a circular regions with 260 arcsec radius  to a point \
		 source and  (R+260) arcsec radius to an extended source, where R is a major axis radius of an object. \
		 Background spectra is extracted in case source free region is available in the field of view. \
		 The number of source regions is limited to eight to ensure that not more than nine regions (eight source regions plus background region) \
		 are fed into the ancillary response generator (see below). This option is very convenient as it produces regions for\
		 real sources automatically. However, it comes with a pitfall, as it uses a python helper script <i>create_symbad_regions.py</i>\
		 It querries the SIMBAD astronomical database and creates regions for various source types for the observed sky area. \
		 Up to 9 regions are created including background (if available). \
		 This Python unit requires a number of modules, namely, <i>numpy</i>, <i>aplpy</i>, <i>pyregion</i>, <i>astroquery</i>",
	         "<li> <span style=\"text-decoration:underline;\">Manual</span><br><br>\
		 When this region setting is specified, the script produces an image from the XIS data being analyzed,\
		 launches <i>ds9</i> image viewer and waits until it is closed. At this point, the script searches for \
		 region files in the analysis directory in the format aeXXXXXXXXXxiS_rNm_src.reg, where XXXXXXXXX is the sequence ID,\
		 I is a XIS identifier and N is a region number between 0 and 8.",
		 "</ul><br><br>",
	    ]
	
	},
	]
    
    },
    {
	title:"SNR Catalog Data Analysis",
	content:[
	{
	    subtitle:"Data Analysis Procedure",
	    name:"reduction",
	    text:[

	    "To extract data products for the catalog we developed an automated analysis pipeline,\
	      implemented as PERL script <i>aexispipe</i>. The particular analysis procedure is \
	      controlled by the script parameters. Where appropriate, we give the corresponding \
	      analysis options, which responsible for a certain analysis  setting.\
	      We also list the analysis script settings in a separate section below.\
	      The presented analysis attempts to perform XIS data analysis as described in the \
	      Suzaku Data Reduction Guide (aka ''ABC Guide''). Within this pipeline we have implemented \
	      the following analysis steps:<br><br>",
	      
	      "1. Observation sequence data download via FTP and initial reprocessing with the Suzaku FTOOL aepipeline.<br><br>",
	      
	      "2.  Clean event list production. This step involves filtering out events\
		recorded by flickering pixels. Regions, containing information on the flickering pixels for \
		particular XIS and CI mode are downloaded from JAXA page at http://www.astro.isas.jaxa.jp/suzaku/analysis/xis/nxb_new/ \
		and applied to the reprocessed cleaned event files produced at the previous step.<br><br>",
		
	      "3.Creating and smoothing XIS image.<br><br>",
	      
	      "4. Generating the spectral extraction regions.",
	      "5. Extract spectra for X-ray source and background regions using <i>xselect</i>.<br><br>",
		"6. Extract spectra and images of the XIS instrumental background commonly referred to as a Non X-ray Background (NXB) using xisnxbgen.\
		 NXB event files have also flickerring pixels removed using the region filtering. FOr convenience and to speed up analysis we have \
		 produced pre-filtered NXB event files from the files provided in the calibration database and use these prefiltered files during the\
		 analysis.<br><br>",
		 "7. Create XIS detector response for the observation and ancillary response (ARF) for the set of regions using <i>xisrmfgen</i> \
		 and <i>xissimarfgen</i> correspondingly. Depending on a particular nature of the source we employ three different prescriptions\
		 for the ARF calculations, which we refer to as \"UNIFORM\", \"POINT\" and \"IMAGE\".  In the first (\"UNIFORM\" source) approach,\
		 the source is assumed to be uniform over the sky. Actual ray-tracing simulations in xissimarfgen models the 3&times;10<sup>6</sup> input photons \
		 coming from the sky region extending 20 arc seconds beyond the XIS field of view. In the \"POINT\" prescription, we assume a point\
		 source at the specified object sky location and model 4&times;10<sup>5</sup> photons. In the last, i.e. \"IMAGE\" setting, the actual XIS source \
		 image is supplied as source configuration and 3&times;10<sup>6</sup> are simulated.<br><br>",
		 "8. Produce rebinned spectra and responses using the standard binning pattern. \
		Namely, 4096 unbinned channels are rebinned to 2048 channels by binning channels between 700 and 2696 with factor of 2 \
		and channels between 2696 and 4096 with factor of 4. We perform this step using rbnpha and <i>rbnrmf</i> FTOOLs respectively.<br><br>",
	        "9. NXB subtracted spectra are produced by subtracting the source spectra and NXB spectra with mathpha FTOOL.<br><br>"
	    ],
	},
	{
	    subtitle:"Spectral Analysis",
	    name:"xspec",
	    text:[
	    "To extract information on spectral lines we analyse the spectra produced for SNR sources in XSPEC astrophysical fitting package.\
	    We combine spectra from all operational XIS detectors during an observation in one XSPEC session as individual data sets. The same\
	    model is applied to all spectra modulo the cross-normalization factors. Spectra are fitted by a sum of a power law (<i>powerlaw</i>\
	    or <i>pegpwrlw</i> XSPEC model) and a set of Gaussians to model emission lines."
	    ]
	    
	}
	]
    
    },
    {
	title:"Catalog Organization",
	content:[
	{
	    subtitle:"Data products and naming conventions",
	    name:"general",
	    text:[
	    "A particular Suzaku observation analysis in the catalog is a set of data products created for a particular set of analysis script (<i>aexispipe</i>)\
	    setting. Therefore, there can be more than one analyses for a particular observation. All data products for analysis reside in one directory under\
	    the observation directory. The directory name is usually (but not necessarily) a name of the region pattern, for example, analysis products for the \"pie\" regions are \
	    placed under &lt;OBSID&gt;/pie directory.",
	    ,
	    ""
	    ],
	    
	},{
	    subtitle:"File naming convention",
	    text:[
		" The data product files names follow the rules below:<br><br>",
		"for spectral files - <pre>aeXXXXXXXXXiii_rNR_SSS_rB.pha,</pre>",
		"for ancillary response files - <pre>aeXXXXXXXXXiii_rNR_SSS.arf,</pre>",
		"for response matrix - <pre>aeXXXXXXXXXiii_SSS_rB.rmf,</pre>",
		"for region files - <pre>aeXXXXXXXXXiii_SSS_src.reg,</pre>",
		"for region files - <pre>aeXXXXXXXXXiii_SSS_src.img,</pre>",
		"where:",
		"<ul><li><tt>ae</tt> is for Astro-E2, as for the archival files</li>",
		"<li><TT>XXXXXXXXX</TT> is the 9 digit observation identifier (sequence number)</li>",
		"<li><TT>NR</TT> is the region identifier, where N is the region number in a set between 0 and 8, R is the region pattern identifier, namely,\
		 S - for standard regions, P - for pie regions, A - for annuli, R -for SIMBAD regions.</li>",
		 "<li><TT>SSS</TT> is the source for spectrum. Namely, src - for total spectrum, nxb - for the NXB spectrum, sxb - for the NXB subtracted spectrum.</li>",
		 "<li><TT>B</TT> is rebinning indicator, i.e. a - original spectrum, b- rebinned spectrum.</li>"
	    ]
	}
	
	]
    }
    ,{
	title:"SNR Emission Line Table",
	content:[
	{
	    subtitle:"General",
	    text:[
	
	    "The purpose of this database is to provide comprehensive account of all X-ray emission lines observed from SNR sources. \
	    This, however, comes with a disclaimer that we provide the line features that we could identify as produced by an observed SNR source.\
	    We do not include lines which are possibly belong to a background and presumably produced by galactic ridge or galactic center.\
	    Therefore, the line table does not have strong iron lines seen in the observations of sources close to the galactic center such as \"Sgr A East\",\
	    G0.9+0.1, G 1.9+0.3 and others."
	    ]
	
	
	},
	{
	    subtitle:"Table content",
	    text:[
	    "Each record includes the following line characteristcs and the information regarding the observation showing the line:",
	    "<ul>",
	    "<li> OBSID -  Suzaku sequence ID.",
	    "<li> SOURCE - the source name as gievn by SUZAMASTER table.",
	    "<li> RA (degree) - RA coordinate of the satellite pointing during the observation.",
	    "<li> DEC (degree) -  DEC coordinate.",
	    "<li> TIME (MJD) during the observation.",
	    "<li> TYPE - SNR type. As of now, it is simply  I for type Ia, II for core collapse SNR, empty if type is unknown.",
	    "<li> EXPOSURE (seconds) - the longest exposure among XISs.",
	    "<li> REDCHI - reduced chi-square statistics for the XSPEC model fit.",
	    "<li> ENERGY (keV) - centroid energy of the Gaussian component.",
	    "<li> MINE (keV) - lower bound for energy determined by the fit.",
	    "<li> MAXE (keV) - upper bound for energy determined by the fit.",
	    "<li> SIGMA (keV) - Gaussian sigma.",
	    "<li> MINSIG (keV) - lower bound for sigma.",
	    "<li> MAXSIG (keV) - upper bound for sigma.",
	    "<li> NORM (photons/cm<sup>2</sup>/s) - normalization of the Gaussian component.",
	    "<li> MINNORM (photons/cm<sup>2</sup>/s) - lower bound for normalization.",
	    "<li> MAXNORM (photons/cm<sup>2</sup>/s) - upper bound for normalization.",
	    "<li> EW (keV) - equivalent  width for the Gaussian.",
	    "<li> MINEW (keV) - lower bound for the equivalent width.",
	    "<li> MAXEW (keV) - upper bound for the equivalent width.",
	    "<li> LINE_ID - emission line identification (e.g. Si_He_Ka, Ar_He_Ka, etc).",
	    "<li> REGION - the region as given by the region setting during the data reduction (e.g r0s).",
	    "<li> INST - XIS detectors used in analysis (e.g. \"xi0 xi1 xi3\")", 
	    "</ul>",
	    ]
	
	}
	]
    }
]
