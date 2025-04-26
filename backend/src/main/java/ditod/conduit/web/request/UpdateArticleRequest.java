package ditod.conduit.web.request;

public record UpdateArticleRequest(Params article) {
    public record Params(String title, String description, String body) {}
}
