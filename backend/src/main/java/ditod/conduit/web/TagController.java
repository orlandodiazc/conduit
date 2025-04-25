package ditod.conduit.web;

import ditod.conduit.core.model.tag.TagRepository;
import ditod.conduit.web.response.TagsResponse;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
public class TagController {
    private final TagRepository tagRepository;

    public TagController(TagRepository tagRepository) {
        this.tagRepository = tagRepository;
    }

    @GetMapping("/tags")
    TagsResponse getTags() {
        return new TagsResponse(tagRepository.findAll());
    }
}
