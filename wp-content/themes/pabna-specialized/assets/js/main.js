( function () {
	'use strict';
	document.documentElement.classList.add( 'js' );

	// Mobile menu.
	var toggle = document.getElementById( 'nav-toggle' );
	var nav = document.getElementById( 'main-nav' );
	function setNav( open ) {
		document.body.classList.toggle( 'nav-open', open );
		if ( toggle ) toggle.setAttribute( 'aria-expanded', open ? 'true' : 'false' );
	}
	if ( toggle && nav ) {
		toggle.addEventListener( 'click', function () {
			setNav( ! document.body.classList.contains( 'nav-open' ) );
		} );
		nav.addEventListener( 'click', function ( e ) {
			if ( e.target.closest( 'a' ) ) setNav( false );
		} );
		document.addEventListener( 'keydown', function ( e ) {
			if ( 'Escape' === e.key ) setNav( false );
		} );
		document.addEventListener( 'click', function ( e ) {
			if ( document.body.classList.contains( 'nav-open' ) && ! nav.contains( e.target ) && ! toggle.contains( e.target ) ) setNav( false );
		} );
	}

	// Header shadow when scrolled.
	var header = document.getElementById( 'site-header' );
	if ( header ) {
		var onScroll = function () { header.classList.toggle( 'is-stuck', window.scrollY > 40 ); };
		window.addEventListener( 'scroll', onScroll, { passive: true } );
		onScroll();
	}

	if ( ! ( 'IntersectionObserver' in window ) ) return;

	// Reveal on scroll.
	var targets = document.querySelectorAll( '.section-head, .service-card, .doctor-card, .why-card, .post-card, .poster-card, .feature, .about-visual, .about-copy, .appt-card, .contact-card' );
	var io = new IntersectionObserver( function ( entries ) {
		entries.forEach( function ( entry ) {
			if ( entry.isIntersecting ) {
				entry.target.classList.add( 'is-in' );
				io.unobserve( entry.target );
			}
		} );
	}, { rootMargin: '0px 0px -8% 0px' } );
	targets.forEach( function ( el, i ) {
		el.classList.add( 'reveal' );
		el.style.transitionDelay = ( i % 4 ) * 70 + 'ms';
		io.observe( el );
	} );

	// Count-up for numeric stats (keeps suffix like "+" or "%"; skips "24/7").
	var counters = document.querySelectorAll( '.stat strong[data-count]' );
	var co = new IntersectionObserver( function ( entries ) {
		entries.forEach( function ( entry ) {
			if ( ! entry.isIntersecting ) return;
			var el = entry.target;
			co.unobserve( el );
			var m = el.dataset.count.match( /^(\d+)(.*)$/ );
			if ( ! m || m[2].charAt( 0 ) === '/' ) return;
			var end = parseInt( m[1], 10 ), suffix = m[2], start = null;
			var step = function ( t ) {
				if ( ! start ) start = t;
				var p = Math.min( ( t - start ) / 1400, 1 );
				el.textContent = Math.round( end * ( 1 - Math.pow( 1 - p, 3 ) ) ) + suffix;
				if ( p < 1 ) requestAnimationFrame( step );
			};
			requestAnimationFrame( step );
		} );
	}, { threshold: .6 } );
	counters.forEach( function ( el ) { co.observe( el ); } );

} )();
