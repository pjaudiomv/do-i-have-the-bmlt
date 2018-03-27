data "aws_route53_zone" "domain" {
  name = "doihavethebmlt.org."
}

resource "aws_route53_record" "cdn_cname_naked" {
  zone_id = "${data.aws_route53_zone.domain.id}"
  name    = "doihavethebmlt.org"
  type    = "A"

  alias {
    name                   = "${aws_cloudfront_distribution.website.domain_name}"
    zone_id                = "${aws_cloudfront_distribution.website.hosted_zone_id}"
    evaluate_target_health = false
  }
}

resource "aws_route53_record" "cdn_cname_www" {
  zone_id = "${data.aws_route53_zone.domain.id}"
  name    = "www.doihavethebmlt.org"
  type    = "A"

  alias {
    name                   = "${aws_cloudfront_distribution.website.domain_name}"
    zone_id                = "${aws_cloudfront_distribution.website.hosted_zone_id}"
    evaluate_target_health = false
  }
}
